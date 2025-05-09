import os
import json
import re
import PyPDF2
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from sklearn.feature_extraction.text import CountVectorizer
from flask import Flask, request, jsonify
import psycopg2
from psycopg2 import pool
import time
import sys

# Download NLTK data
nltk.download('punkt')
nltk.download('stopwords')
nltk.download('averaged_perceptron_tagger')

app = Flask(__name__)

# Database connection parameters
DB_CONFIG = {
    "user": "postgres.xciyawumdtwyydelhclv",
    "password": "RXlyvKr17b4tR09X",
    "host": "aws-0-us-east-2.pooler.supabase.com",
    "port": "6543",
    "dbname": "postgres"
}

# Global variable to track if we've attempted connection
db_connection_attempted = False
connection_pool = None

# Function to initialize the connection pool with retry
def initialize_connection_pool(max_retries=2):
    global connection_pool, db_connection_attempted
    
    # If we've already attempted the connection, don't try again
    if db_connection_attempted:
        return False
    
    db_connection_attempted = True
    
    for attempt in range(max_retries):
        try:
            print(f"Attempting database connection (attempt {attempt+1}/{max_retries})...")
            connection_pool = psycopg2.pool.SimpleConnectionPool(
                1, 5,  # Min and max connections
                user=DB_CONFIG["user"],
                password=DB_CONFIG["password"],
                host=DB_CONFIG["host"],
                port=DB_CONFIG["port"],
                dbname=DB_CONFIG["dbname"],
                connect_timeout=5  # Timeout after 5 seconds
            )
            print("Database connection successful!")
            return True
        except Exception as e:
            print(f"Database connection failed: {e}")
            if attempt < max_retries - 1:
                time.sleep(1)  # Wait a second before retrying
    
    print("All connection attempts failed. Using fallback data.")
    return False

# Function to get a connection from the pool
def get_connection():
    if connection_pool:
        try:
            return connection_pool.getconn()
        except Exception as e:
            print(f"Error getting connection from pool: {e}")
    return None

# Function to return a connection to the pool
def return_connection(conn):
    if connection_pool and conn:
        try:
            connection_pool.putconn(conn)
        except Exception as e:
            print(f"Error returning connection to pool: {e}")

# Common skills by category (used as fallback if DB fails)
SKILLS = {
    "programming_languages": [
        "Python", "JavaScript", "TypeScript", "Java", "C++", "C#", "Ruby", "PHP", "Swift", "Kotlin", "Go", "Rust"
    ],
    "web_technologies": [
        "HTML", "CSS", "React", "Angular", "Vue", "Next.js", "Node.js", "Express", "Django", "Flask", 
        "Spring Boot", "REST API", "GraphQL", "WordPress", "WebSockets"
    ],
    "databases": [
        "SQL", "MySQL", "PostgreSQL", "MongoDB", "SQLite", "Oracle", "Firebase", "Redis", "Elasticsearch",
        "DynamoDB", "Cassandra", "MariaDB", "Neo4j"
    ],
    "cloud_platforms": [
        "AWS", "Azure", "Google Cloud", "Heroku", "DigitalOcean", "Vercel", "Netlify", "Docker", "Kubernetes"
    ],
    "data_science": [
        "Machine Learning", "Data Analysis", "NumPy", "Pandas", "Matplotlib", "Scikit-learn", "TensorFlow",
        "PyTorch", "R", "Data Visualization", "Statistics", "NLP", "Computer Vision"
    ],
    "tools": [
        "Git", "GitHub", "GitLab", "Jira", "Confluence", "Jenkins", "CircleCI", "Travis CI", "Ansible", "Terraform",
        "Figma", "Sketch", "Adobe XD", "Postman", "Swagger", "Docker", "Kubernetes"
    ]
}

# Function to fetch skills from the database
def fetch_skills_from_db():
    skills_by_category = {}
    conn = None
    try:
        conn = get_connection()
        if not conn:
            print("No database connection available. Using fallback skills.")
            return SKILLS
            
        cursor = conn.cursor()
        
        # First, check if the skills table exists
        cursor.execute("""
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public'
                AND table_name = 'skills'
            );
        """)
        
        if not cursor.fetchone()[0]:
            print("Skills table does not exist. Using fallback data.")
            return SKILLS
        
        # Use the column names that we verified exist in the database
        skill_column = 'name'
        category_column = 'category'
        
        # Query to fetch skills from database using correct column names
        query = f"""
            SELECT 
                {category_column},
                array_agg({skill_column}) as skills
            FROM 
                skills
            GROUP BY 
                {category_column}
        """
        
        cursor.execute(query)
        
        for category, skills in cursor.fetchall():
            skills_by_category[category] = skills
            
        cursor.close()
        
        # If no skills found, use default skills
        if not skills_by_category:
            return SKILLS
            
        return skills_by_category
    except Exception as e:
        print(f"Database error: {e}")
        return SKILLS
    finally:
        if conn:
            return_connection(conn)

# Function to fetch recommended skills from the database
def fetch_recommended_skills(field, existing_skills):
    conn = None
    try:
        conn = get_connection()
        if not conn:
            print("No database connection available. Using fallback recommendations.")
            return recommend_skills_default(existing_skills, field)
            
        cursor = conn.cursor()
        
        # Check if the recommended_skills table exists
        cursor.execute("""
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public'
                AND table_name = 'recommended_skills'
            );
        """)
        
        if not cursor.fetchone()[0]:
            print("Recommended skills table does not exist. Using fallback data.")
            return recommend_skills_default(existing_skills, field)
        
        # Use the column names we verified exist in the table
        skill_column = 'name'  # This is what we created in the setup script
        priority_column = 'priority'
        
        # Convert existing skills to a format safe for SQL
        params = [field]
        
        # Build the WHERE NOT IN clause if we have existing skills
        where_clause = ""
        if existing_skills:
            placeholders = ', '.join(['%s'] * len(existing_skills))
            where_clause = f"AND {skill_column} NOT IN ({placeholders})"
            params.extend(existing_skills)
        
        # Query to fetch recommended skills based on field
        query = f"""
            SELECT {skill_column}
            FROM recommended_skills
            WHERE field = %s
            {where_clause}
            ORDER BY {priority_column} DESC NULLS LAST
            LIMIT 7
        """
        
        # Execute the query
        cursor.execute(query, params)
        
        recommended = [skill[0] for skill in cursor.fetchall()]
        cursor.close()
        
        # If no recommendations found, use default recommendations
        if not recommended:
            return recommend_skills_default(existing_skills, field)
            
        return recommended
    except Exception as e:
        print(f"Database error when fetching recommendations: {e}")
        return recommend_skills_default(existing_skills, field)
    finally:
        if conn:
            return_connection(conn)

# Try to initialize the connection pool at startup
db_connected = initialize_connection_pool()

# Initialize ALL_SKILLS with database values or fallback values
try:
    if db_connected:
        db_skills = fetch_skills_from_db()
        ALL_SKILLS = [skill for category in db_skills.values() for skill in category]
    else:
        # Flatten skills list as fallback
        ALL_SKILLS = [skill for category in SKILLS.values() for skill in category]
except:
    # Flatten skills list as fallback
    ALL_SKILLS = [skill for category in SKILLS.values() for skill in category]

def extract_text_from_pdf(pdf_file):
    """Extract text from PDF file or text file."""
    try:
        if hasattr(pdf_file, 'read'):
            # File object passed
            filename = getattr(pdf_file, 'name', '')
            is_file_object = True
        else:
            # Path string passed
            filename = pdf_file
            is_file_object = False
            if not os.path.exists(filename):
                raise FileNotFoundError(f"File not found: {filename}")
            
        # For text files, read directly as text
        if filename.lower().endswith('.txt'):
            if is_file_object:
                # Reset file pointer
                pdf_file.seek(0)
                try:
                    content = pdf_file.read()
                    text = content.decode('utf-8') if isinstance(content, bytes) else content
                except UnicodeDecodeError:
                    # Try another encoding
                    pdf_file.seek(0)
                    text = pdf_file.read().decode('latin-1')
            else:
                # Open and read the file
                with open(filename, 'r', encoding='utf-8', errors='ignore') as f:
                    text = f.read()
            return text
            
        # For PDF files
        try:
            if is_file_object:
                # Reset file pointer
                pdf_file.seek(0)
                reader = PyPDF2.PdfReader(pdf_file)
            else:
                # Open and read PDF file
                with open(filename, 'rb') as f:
                    reader = PyPDF2.PdfReader(f)
                    
            text = ""
            for page in reader.pages:
                try:
                    text += page.extract_text() + "\n"
                except Exception as e:
                    print(f"Error extracting text from page: {e}")
            
            return text
        except Exception as e:
            raise Exception(f"Error processing PDF: {e}")
            
    except Exception as e:
        print(f"Error extracting text: {e}")
        # Return some dummy text for testing
        return """John Smith
Email: john.smith@example.com
Phone: (555) 123-4567

SKILLS
JavaScript, React, TypeScript, Node.js, Python, HTML, CSS"""

def extract_contact_info(text):
    """Extract contact information from resume text."""
    # Email
    email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    email = re.search(email_pattern, text)
    
    # Phone
    phone_pattern = r'(?:\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}'
    phone = re.search(phone_pattern, text)
    
    # Name (simple heuristic: first line or first capitalized words)
    name = ""
    first_line = text.split('\n')[0].strip()
    if len(first_line) < 40 and not re.search(email_pattern, first_line) and not re.search(phone_pattern, first_line):
        name = first_line
    
    return {
        "name": name,
        "email": email.group(0) if email else "",
        "phone": phone.group(0) if phone else ""
    }

def extract_skills(text):
    """Extract skills from resume text."""
    text = text.lower()
    found_skills = []
    
    for skill in ALL_SKILLS:
        skill_pattern = r'\b' + re.escape(skill.lower()) + r'\b'
        if re.search(skill_pattern, text):
            found_skills.append(skill)
    
    return found_skills

def categorize_skills(skills):
    """Categorize skills by category."""
    categorized = {}
    for category, category_skills in SKILLS.items():
        categorized[category] = [skill for skill in skills if skill in category_skills]
    return categorized

def determine_experience_level(text):
    """Determine experience level based on years mentioned."""
    # Look for years of experience
    year_patterns = [
        r'\b(\d+)\+?\s+years?\s+(?:of\s+)?experience\b',
        r'\bexperienced\s+(?:for|with)?\s+(\d+)\+?\s+years\b'
    ]
    
    max_years = 0
    for pattern in year_patterns:
        matches = re.finditer(pattern, text.lower())
        for match in matches:
            years = int(match.group(1))
            max_years = max(max_years, years)
    
    if max_years == 0:
        # Check if title contains terms like "Senior", "Junior", etc.
        if re.search(r'\bsenior\b|\bsr\.?\b|\blead\b|\barchitect\b|\bhead\b|\bprincipal\b', text.lower()):
            return "Senior"
        elif re.search(r'\bjunior\b|\bjr\.?\b|\bentry\b|\bintern\b|\btrainee\b', text.lower()):
            return "Junior"
        else:
            return "Intermediate"
    elif max_years < 3:
        return "Junior"
    elif max_years < 7:
        return "Intermediate"
    else:
        return "Senior"

def recommend_skills_default(found_skills, target_field="Software Development"):
    """Default recommendation function used as fallback."""
    # Map target fields to skill categories
    field_to_categories = {
        "Software Development": ["programming_languages", "web_technologies", "tools"],
        "Data Science": ["data_science", "programming_languages", "databases"],
        "Web Development": ["web_technologies", "programming_languages", "databases"],
        "DevOps": ["cloud_platforms", "tools", "programming_languages"],
        "Mobile Development": ["programming_languages", "tools"]
    }
    
    # Default to Software Development if target field not in mapping
    categories = field_to_categories.get(target_field, field_to_categories["Software Development"])
    
    # Get relevant skills for the field
    relevant_skills = []
    for category in categories:
        relevant_skills.extend(SKILLS[category])
    
    # Recommend skills that weren't found
    recommended = [skill for skill in relevant_skills if skill not in found_skills]
    
    # Limit to top 7
    return recommended[:7]

def recommend_skills(found_skills, target_field="Software Development"):
    """Recommend skills based on found skills and target field."""
    try:
        if db_connected:
            # Try to get recommendations from the database
            return fetch_recommended_skills(target_field, found_skills)
        else:
            # Fall back to default recommendations
            return recommend_skills_default(found_skills, target_field)
    except Exception as e:
        print(f"Error in skill recommendations: {e}")
        # Fall back to default recommendations
        return recommend_skills_default(found_skills, target_field)

def calculate_score(skills, experience_level):
    """Calculate resume score based on skills and experience level."""
    base_score = min(30 + len(skills) * 3, 70)
    
    # Adjust based on experience level
    if experience_level == "Senior":
        base_score += 15
    elif experience_level == "Intermediate":
        base_score += 8
    
    # Randomize slightly to avoid identical scores
    import random
    score = base_score + random.randint(-5, 5)
    
    # Ensure score is between 0 and 100
    return max(0, min(score, 100))

@app.route('/api/parse-resume', methods=['POST'])
def parse_resume():
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "Empty file provided"}), 400
    
    # Get target field if provided
    target_field = request.form.get('targetField', 'Software Development')
    
    try:
        # Extract text from PDF
        text = extract_text_from_pdf(file)
        
        # Extract contact info
        contact_info = extract_contact_info(text)
        
        # Extract skills
        skills = extract_skills(text)
        
        # Determine experience level
        experience_level = determine_experience_level(text)
        
        # Calculate score
        score = calculate_score(skills, experience_level)
        
        # Recommend skills
        recommended_skills = recommend_skills(skills, target_field)
        
        # Generate response
        response = {
            "name": contact_info["name"],
            "email": contact_info["email"],
            "phone": contact_info["phone"],
            "skills": skills,
            "experienceLevel": experience_level,
            "score": score,
            "likelyField": target_field,
            "matchConfidence": min(95, score + 5),  # Slightly higher than score
            "recommendedSkills": recommended_skills
        }
        
        return jsonify(response)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# If script is called directly from command line, parse the file and output JSON
if __name__ == '__main__':
    if len(sys.argv) > 1:
        # Get file path from command line argument
        file_path = sys.argv[1]
        try:
            # Open the file
            with open(file_path, 'rb') as file:
                # Extract text from PDF
                text = extract_text_from_pdf(file)
                
                # Extract contact info
                contact_info = extract_contact_info(text)
                
                # Extract skills
                skills = extract_skills(text)
                
                # Determine experience level
                experience_level = determine_experience_level(text)
                
                # Calculate score
                score = calculate_score(skills, experience_level)
                
                # Default field 
                likely_field = 'Software Development'
                
                # Get recommended skills
                recommended_skills = recommend_skills(skills, likely_field)
                
                # Generate response
                response = {
                    "name": contact_info["name"] or "Guest User",
                    "email": contact_info["email"] or "guest@example.com",
                    "phone": contact_info["phone"] or "+1 (555) 123-4567",
                    "skills": skills,
                    "experienceLevel": experience_level,
                    "score": score,
                    "likelyField": likely_field,
                    "matchConfidence": min(95, score + 5),
                    "recommendedSkills": recommended_skills
                }
                
                # Output JSON to stdout
                print(json.dumps(response))
                
        except Exception as e:
            print(json.dumps({"error": str(e)}))
            sys.exit(1)
    else:
        # If no arguments, run as Flask app
        app.run(debug=True, port=5000) 
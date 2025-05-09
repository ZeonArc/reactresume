import os
import psycopg2
from psycopg2 import pool
from dotenv import load_dotenv

# Database connection parameters (from environment or hardcoded)
DB_CONFIG = {
    "user": "postgres.xciyawumdtwyydelhclv",
    "password": "RXlyvKr17b4tR09X",
    "host": "aws-0-us-east-2.pooler.supabase.com",
    "port": "6543",
    "dbname": "postgres"
}

def setup_database():
    """Setup the database schema and initial data"""
    conn = None
    try:
        # Connect to the database
        print("Connecting to Supabase PostgreSQL database...")
        conn = psycopg2.connect(
            user=DB_CONFIG["user"],
            password=DB_CONFIG["password"],
            host=DB_CONFIG["host"],
            port=DB_CONFIG["port"],
            dbname=DB_CONFIG["dbname"]
        )
        
        # Create a cursor
        cursor = conn.cursor()
        
        # Check if skills table already exists
        cursor.execute("""
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public'
                AND table_name = 'skills'
            );
        """)
        
        skills_table_exists = cursor.fetchone()[0]
        skill_column = 'skill_name'
        category_column = 'category'
        
        if skills_table_exists:
            # Check the columns in the skills table
            cursor.execute("""
                SELECT column_name
                FROM information_schema.columns
                WHERE table_schema = 'public'
                AND table_name = 'skills';
            """)
            
            columns = [col[0] for col in cursor.fetchall()]
            print(f"Existing skills table columns: {columns}")
            
            # Determine the skill and category column names
            if 'name' in columns:
                skill_column = 'name'
            if 'type' in columns and 'category' not in columns:
                category_column = 'type'
                
            print(f"Using column names: {skill_column} for skill and {category_column} for category")
        
        # Check if recommended_skills table exists
        cursor.execute("""
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public'
                AND table_name = 'recommended_skills'
            );
        """)
        
        recommended_skills_exists = cursor.fetchone()[0]
        rec_skill_column = 'skill_name'
        priority_column = 'priority'
        
        if recommended_skills_exists:
            # Check the columns in the recommended_skills table
            cursor.execute("""
                SELECT column_name
                FROM information_schema.columns
                WHERE table_schema = 'public'
                AND table_name = 'recommended_skills';
            """)
            
            rec_columns = [col[0] for col in cursor.fetchall()]
            print(f"Existing recommended_skills table columns: {rec_columns}")
            
            # Determine the skill and priority column names
            if 'name' in rec_columns:
                rec_skill_column = 'name'
            if 'importance' in rec_columns and 'priority' not in rec_columns:
                priority_column = 'importance'
                
            print(f"Using column names: {rec_skill_column} for recommended skill and {priority_column} for priority")
        
        # Create skills table if it doesn't exist
        if not skills_table_exists:
            print("Creating skills table...")
            cursor.execute(f"""
                CREATE TABLE IF NOT EXISTS skills (
                    id SERIAL PRIMARY KEY,
                    {skill_column} VARCHAR(100) NOT NULL UNIQUE,
                    {category_column} VARCHAR(50) NOT NULL,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                )
            """)
        
        # Create recommended_skills table if it doesn't exist
        if not recommended_skills_exists:
            print("Creating recommended_skills table...")
            cursor.execute(f"""
                CREATE TABLE IF NOT EXISTS recommended_skills (
                    id SERIAL PRIMARY KEY,
                    {rec_skill_column} VARCHAR(100) NOT NULL,
                    field VARCHAR(50) NOT NULL,
                    {priority_column} INTEGER DEFAULT 0,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                    UNIQUE({rec_skill_column}, field)
                )
            """)
        
        # Insert skills data
        print("Inserting skills data...")
        # Sample skills to insert (shortened for brevity)
        skills_data = [
            ('JavaScript', 'programming_languages'),
            ('Python', 'programming_languages'),
            ('React', 'web_technologies'),
            ('Node.js', 'web_technologies'),
            ('SQL', 'databases'),
            ('AWS', 'cloud_platforms'),
            ('Machine Learning', 'data_science'),
            ('Git', 'tools')
        ]
        
        # Insert each skill
        for skill, category in skills_data:
            try:
                cursor.execute(f"""
                    INSERT INTO skills ({skill_column}, {category_column})
                    VALUES (%s, %s)
                    ON CONFLICT ({skill_column}) DO NOTHING
                """, (skill, category))
            except Exception as e:
                print(f"Error inserting skill {skill}: {e}")
        
        # Insert recommended skills data
        print("Inserting recommended skills data...")
        # Sample recommended skills (shortened for brevity)
        rec_skills_data = [
            ('Docker', 'Software Development', 10),
            ('TypeScript', 'Web Development', 9),
            ('TensorFlow', 'Data Science', 8)
        ]
        
        # Insert each recommended skill
        for skill, field, priority in rec_skills_data:
            try:
                cursor.execute(f"""
                    INSERT INTO recommended_skills ({rec_skill_column}, field, {priority_column})
                    VALUES (%s, %s, %s)
                    ON CONFLICT ({rec_skill_column}, field) DO NOTHING
                """, (skill, field, priority))
            except Exception as e:
                print(f"Error inserting recommended skill {skill}: {e}")
        
        # Commit the changes
        conn.commit()
        print("Database setup completed successfully!")
        
        # Verify data
        cursor.execute(f"SELECT COUNT(*) FROM skills")
        skill_count = cursor.fetchone()[0]
        print(f"Total skills in database: {skill_count}")
        
        cursor.execute(f"SELECT COUNT(*) FROM recommended_skills")
        rec_skill_count = cursor.fetchone()[0]
        print(f"Total recommended skills in database: {rec_skill_count}")
        
    except Exception as e:
        print(f"Error setting up database: {e}")
    finally:
        if conn:
            conn.close()
            print("Database connection closed.")

if __name__ == "__main__":
    setup_database() 
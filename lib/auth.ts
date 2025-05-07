"use client"

import type { User } from "./types"

// In a real application, this would be a server-side API call
// For demo purposes, we're using localStorage to simulate authentication

interface StoredUser extends User {
  password: string;
}

export async function registerUser(
  firstName: string,
  lastName: string,
  email: string,
  password: string,
): Promise<boolean> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  try {
    // Check if user already exists
    const existingUsers: StoredUser[] = JSON.parse(localStorage.getItem("users") || "[]")
    const userExists = existingUsers.some((user) => user.email === email)

    if (userExists) {
      return false
    }

    // Create new user
    const newUser: StoredUser = {
      id: Date.now(),
      firstName,
      lastName,
      email,
      password, // In a real app, this would be hashed on the server
    }

    // Save user
    existingUsers.push(newUser)
    localStorage.setItem("users", JSON.stringify(existingUsers))

    return true
  } catch (error) {
    console.error("Registration error:", error)
    return false
  }
}

export async function loginUser(email: string, password: string): Promise<User | null> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  try {
    const users: StoredUser[] = JSON.parse(localStorage.getItem("users") || "[]")
    const user = users.find((u) => u.email === email && u.password === password)

    if (user) {
      // Store session
      const sessionUser: User = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      }

      localStorage.setItem("currentUser", JSON.stringify(sessionUser))
      return sessionUser
    }

    return null
  } catch (error) {
    console.error("Login error:", error)
    return null
  }
}

export async function getUserSession(): Promise<User | null> {
  try {
    const userJson = localStorage.getItem("currentUser")
    if (!userJson) return null

    return JSON.parse(userJson) as User
  } catch (error) {
    console.error("Session error:", error)
    return null
  }
}

export async function logout(): Promise<void> {
  localStorage.removeItem("currentUser")
}

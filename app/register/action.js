'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '../../utils/supabase/server'

export async function login(credentials) {
    const supabase = createClient()

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const data = {
        email: credentials.email,
        password: credentials.password,
    }

    const { error } = await supabase.auth.signInWithPassword(data)

    console.log("error")
    console.log(error)

    if (error) {
        console.log("error in logging in")
        redirect('/error')
    }

    console.log("login successful")
    revalidatePath('/dashboard', 'layout')
    redirect("/dashboard")
}

export async function signup(credentials) {
    const supabase = createClient()

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const data = {
        email: credentials.email,
        password: credentials.password,
    }

    const { error } = await supabase.auth.signUp(data)

    if (error) {
        console.log("error in logging")
        redirect('/error')
    }

    console.log("login successful")
    revalidatePath('/dashboard', 'layout')
    redirect('/dashboard')
}
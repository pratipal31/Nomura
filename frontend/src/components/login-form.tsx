"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRef } from 'react';

export function LoginForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const loginEmail = useRef(null);
    const loginPassword = useRef(null);
    return (

        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle>Login to your account</CardTitle>
                    <CardDescription>
                        Enter your email below to login to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={async (e) => {
                        e.preventDefault();

                        try {
                            const response = await fetch("http://127.0.0.1:5000/login", {
                                method: "POST",
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    email: loginEmail?.current.value,
                                    password: loginPassword?.current.value
                                })
                            });
                            const data = await response.json();

                            if (data.mesaage === "Logged in successfully.") {
                                // Redirect to the homepage or any other desired route
                                window.location.href = '/';
                            } else {
                                alert("Invalid credentials");
                            }
                        } catch (err) {
                            console.error(err);
                            alert("An error occurred while logging in.");
                        }
                    }}
                    >

                        <div className="flex flex-col gap-6">
                            <div className="grid gap-3">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="loginEmail"
                                    placeholder="m@example.com"
                                    required
                                    ref={loginEmail}
                                />
                            </div>
                            <div className="grid gap-3">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                    <a
                                        href="#"
                                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                    >
                                        Forgot your password?
                                    </a>
                                </div>
                                <Input id="password" type="password" required ref={loginPassword} />
                            </div>
                            <div className="flex flex-col gap-3">
                                <Button type="submit" className="w-full">
                                    Login
                                </Button>
                            </div>
                        </div>
                        <div className="mt-4 text-center text-sm">
                            Don&apos;t have an account?{" "}
                            <a href="/register" className="underline underline-offset-4">
                                Register
                            </a>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

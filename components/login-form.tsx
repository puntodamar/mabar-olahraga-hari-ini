"use client"

import {useState} from "react"
import {useRouter} from "next/navigation"

import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card"
import {Field, FieldGroup, FieldLabel,} from "@/components/ui/field"
import {Input} from "@/components/ui/input"

export function LoginForm({className, ...props}: React.ComponentProps<"div">) {
    const router = useRouter()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    async function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
        event.preventDefault()

        setLoading(true)

        try {
            const response = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({email, password,}),
            })

            if (!response.ok) {
                setError("Invalid email or password")
                return
            }

            setError("")
            router.push("/admin/schedules")
            router.refresh()
        } catch {
            setError("Unable to login")
        } finally {
            setLoading(false)
        }
    }

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
                    <form onSubmit={handleSubmit}>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="email@example.com"
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                    required
                                />
                            </Field>

                            <Field>
                                <div className="flex items-center">
                                    <FieldLabel htmlFor="password">Password</FieldLabel>
                                </div>

                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                    required
                                />
                            </Field>

                            <p className={cn("min-h-5 text-sm text-destructive", !error && "invisible")} aria-live="polite">
                                {error || "placeholder"}
                            </p>

                            <Field>
                                <Button type="submit" disabled={loading} className="w-28">
                                    <span className="flex items-center justify-center gap-2">
                                        {loading && (
                                            <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                        )}
                                        {loading ? "Logging in..." : "Login"}
                                    </span>
                                </Button>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

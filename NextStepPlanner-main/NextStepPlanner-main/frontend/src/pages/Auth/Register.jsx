import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { ButtonLoader } from "../../components/ui/Loader";
import ThemeToggle from "../../components/ThemeToggle";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

export default function Register() {
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const password = watch("password");

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const result = await signup(data.name, data.email, data.password);
      if (result.success) {
        toast.success("Account created successfully!");
        // Navigate to dashboard after successful signup
        navigate("/dashboard", { replace: true });
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-foreground">
              NextStep Planner
            </h2>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Create your account
            </p>
          </div>
          <ThemeToggle />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>
              Create an account to start planning your next steps.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-foreground mb-1"
                >
                  Full name
                </label>
                <Input
                  id="name"
                  type="text"
                  autoComplete="name"
                  {...register("name", {
                    required: "Name is required",
                    minLength: {
                      value: 2,
                      message: "Name must be at least 2 characters",
                    },
                  })}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-foreground mb-1"
                >
                  Email address
                </label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-foreground mb-1"
                >
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-foreground mb-1"
                >
                  Confirm password
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <ButtonLoader text="Creating account..." />
                ) : (
                  "Create account"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-primary hover:text-primary/90"
              >
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

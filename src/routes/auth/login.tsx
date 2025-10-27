import { createFileRoute, Link } from "@tanstack/react-router";
import { Brain } from "lucide-react";
// import { Button } from "@/shared/components/ui/button";
// import { Label } from "@/shared/components/ui/label";
// import { Input } from "@/shared/components/ui/input";
// import { Separator } from "@/shared/components/ui/separator";
import { createAuthClient } from "better-auth/client";
export const Route = createFileRoute("/auth/login")({
  component: RouteComponent,
});

function RouteComponent() {
  const authClient = createAuthClient();
  const signIn = async () => {
    const data = await authClient.signIn.social(
      {
        newUserCallbackURL: "/welcome",
        provider: "github",
        errorCallbackURL: "",
        callbackURL: "/dashboard",
      },
      {
        onError: (error) => {
          console.log("Login error: ", error);
          // display modal
        },
      }
    );

    console.log(data);
  };

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <div className="flex justify-center">
            <Brain className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email and password to log in to your account
          </p>
        </div>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" placeholder="name@example.com" />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <label htmlFor="password">Password</label>
              <Link
                // to="/forgot-password"
                to="/"
                className="text-sm text-primary underline-offset-4 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <input id="password" type="password" />
          </div>
          <button className="w-full">Log In</button>
        </div>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            {/* <Separator className="w-full" /> */}-
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <div className="grid gap-2">
          <button className="w-full">Google</button>
          <button className="w-full" onClick={signIn}>
            GitHub
          </button>
        </div>
        <div className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link
            to="/"
            className="text-primary underline-offset-4 hover:underline"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}

// /* eslint-disable @typescript-eslint/no-explicit-any */
// // import { Button } from "@/components/ui/button";
// // import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// // import { zodResolver } from "@hookform/resolvers/zod";
// // import { useForm } from "react-hook-form";
// // import { z } from "zod";
// // import { Link, useNavigate } from "react-router-dom";
// // import { axiosInstance, NewAxiosResponse } from "@/lib/fetch";
// // import { Loader2 } from "lucide-react";
// // import { useToast } from "@/hooks/use-toast";
// import Logo from "@/components/build/Logo";
// // import { useState } from "react";
// // import { useAuthStore } from "@/lib/store/stateStore";

// export default function Login() {
//   // const { setUser } = useAuthStore();
//   // const [loading, setLoading] = useState(false);
//   // const { toast } = useToast();
//   // const navigate = useNavigate();
//   // const {
//   //   register,
//   //   handleSubmit,
//   //   formState: { errors },
//   // } = useForm<LoginSchemaType>({ resolver: zodResolver(loginUserSchema) });

//   // const onSubmit = async (data: LoginSchemaType) => {
//   //   setLoading(!loading);

//   //   try {
//   //     const response: NewAxiosResponse = await axiosInstance.post(
//   //       `/auth/login`,
//   //       {
//   //         username: data.username,
//   //         password: data.password,
//   //       }
//   //     );
//   //     setUser(response.data.data);

//   //     toast({
//   //       title: `${response.data ? response.data.message : "Success"}`,
//   //       description: `welcome back, ${data.username}`,
//   //     });

//   //     return navigate("/onboard");
//   //   } catch (error: any) {
//   //     console.log(error);

//   //     if (error.request) {
//   //       toast({
//   //         variant: "destructive",
//   //         title: "Error!",
//   //         description: `${error.response.data.message}`,
//   //       });
//   //       return null;
//   //     } else {
//   //       toast({
//   //         variant: "destructive",
//   //         description: "Something went wrong, try again later!",
//   //       });
//   //       return null;
//   //     }
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   return (
//     <main>
//       <div className="flex min-h-screen flex-col items-center justify-center">
//         <div className="h-full w-full px-2 py-4 sm:w-2/3 md:w-1/2">
//           <div className="mx-auto flex flex-col justify-center px-2">
//             <div className="mb-2">
//               <Logo className="" text="BondSpace" />
//             </div>

//             <h1 className="text-2xl font-medium">Welcome back!</h1>
//             <Label className="text-neutral-500">
//               Log in to reconnect with your friends and communities.
//             </Label>

//             {/* <form
//               method="post"
//               onSubmit={handleSubmit(onSubmit)}
//               className="mt-8 flex flex-col gap-y-4"
//             >
//               <div>
//                 <Label className="text-xs">Username</Label>
//                 <Input
//                   type="text"
//                   {...register("username")}
//                   placeholder="Enter your username."
//                 />
//                 {errors.username && (
//                   <Label className="text-xs text-red-500">
//                     {errors.username?.message}
//                   </Label>
//                 )}
//               </div>
//               <div>
//                 <Label className="text-xs">Password</Label>
//                 <Input
//                   type="password"
//                   {...register("password")}
//                   placeholder="Enter your password."
//                 />
//                 {errors.password && (
//                   <Label className="text-xs text-red-500">
//                     {errors.password?.message}
//                   </Label>
//                 )}
//                 <p className="mt-2 text-right text-sm font-medium text-purple-600">
//                   Forgot your password?{" "}
//                   <Link to="/forgot-password" className="underline">
//                     Reset it here
//                   </Link>
//                 </p>
//               </div>

//               <Button type="submit" className="mt-4">
//                 {loading ? <Loader2 className="animate-spin" /> : "Log In"}
//               </Button>

//               <p className="flex items-center gap-2 text-center text-sm font-medium text-neutral-500">
//                 Don't have an account?{" "}
//                 <Link to="/register" className="underline-offset-1">
//                   <span className="text-purple-600">Register here</span>
//                 </Link>
//               </p>
//             </form> */}
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// }

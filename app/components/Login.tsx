import { signIn, useSession } from "next-auth/react";

const Login = () => {
  const { data: session } = useSession();

  if (!session) {
    return (
      <button
        onClick={() => signIn("google", { callbackUrl: "/" })}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Google로 로그인
      </button>
    );
  }

  return null;
};

export default Login;

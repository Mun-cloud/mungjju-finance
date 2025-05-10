import { signOut, useSession } from "next-auth/react";

const UserInfo = () => {
  const { data: session } = useSession();

  if (!session) return null;

  return (
    <div className="flex justify-between items-center mb-4">
      <div>
        <p className="text-sm text-gray-600">
          {session.user?.email}으로 로그인됨
        </p>
      </div>
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
      >
        로그아웃
      </button>
    </div>
  );
};

export default UserInfo;

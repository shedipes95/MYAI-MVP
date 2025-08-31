interface MyAILogoProps {
  showGO?: boolean;
}

export default function MyAILogo({ showGO = false }: MyAILogoProps) {
  return (
    <div className="flex items-center space-x-3">
      <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-pink-500">
        MyAI
      </h1>
      {showGO && (
        <div className="w-14 h-14 bg-gradient-to-tr from-blue-500 via-purple-600 to-pink-500 rounded-full flex items-center justify-center shadow-xl">
          <span className="text-white text-xl font-bold">GO</span>
        </div>
      )}
    </div>
  );
}

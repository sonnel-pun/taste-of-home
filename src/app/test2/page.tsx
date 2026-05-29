"use client";

export default function Test2Page() {
  const handleClick = (e: React.MouseEvent, msg: string) => {
    e.preventDefault();
    alert(msg);
    console.log('clicked:', msg);
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-6">Test v3: Using &lt;a&gt; tags</h1>
      
      <a
        href="#"
        onClick={(e) => handleClick(e, "A TAG onClick WORKS!")}
        className="block w-full mb-4 p-4 bg-accent text-white rounded-xl text-lg font-bold text-center"
        style={{ cursor: "pointer", WebkitTapHighlightColor: "transparent", textDecoration: "none" }}
      >
        &lt;a&gt; tag with onClick
      </a>

      <a
        href="https://google.com"
        className="block w-full mb-4 p-4 bg-purple-500 text-white rounded-xl text-lg font-bold text-center"
        style={{ cursor: "pointer", textDecoration: "none" }}
      >
        &lt;a&gt; tag to Google (native)
      </a>

      <div
        onClick={() => alert("DIV onClick WORKS!")}
        className="mb-4 p-4 bg-green-500 text-white rounded-xl text-lg font-bold text-center"
        style={{ cursor: "pointer", WebkitTapHighlightColor: "transparent" }}
      >
        &lt;div&gt; with onClick
      </div>

      <button
        type="button"
        onClick={() => alert("BUTTON onClick WORKS!")}
        className="block w-full mb-4 p-4 bg-blue-500 text-white rounded-xl text-lg font-bold"
        style={{ cursor: "pointer", WebkitTapHighlightColor: "transparent" }}
      >
        &lt;button&gt; with onClick
      </button>

      <p className="text-sm text-muted mt-8">
        If the &lt;a&gt; tag works but others don't, we know the fix.
      </p>
    </div>
  );
}

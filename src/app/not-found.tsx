export default function RootNotFound() {
  return (
    <html lang="en">
      <body
        style={{
          fontFamily: "system-ui, sans-serif",
          display: "flex",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <main style={{ textAlign: "center" }}>
          <h1>Page not found</h1>
          <p>
            <a href="/en">Back to home</a>
          </p>
        </main>
      </body>
    </html>
  );
}

async function getBackendMessage() {
  const res = await fetch('http://localhost:3001/api', { cache: 'no-store' });
  const text = await res.text();
  return text;
}

export default async function Home() {
  const message = await getBackendMessage();

  return (
    <main style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h1>Librairie en ligne</h1>
      <p>Réponse du backend NestJS : <strong>{message}</strong></p>
    </main>
  );
}
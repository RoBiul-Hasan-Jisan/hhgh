export default function NotFound() {
	return (
		<div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5' }}>
			<div style={{ textAlign: 'center' }}>
				<h1 style={{ fontSize: '4rem', fontWeight: 'bold', margin: 0 }}>404</h1>
				<p style={{ fontSize: '1.25rem', marginTop: '1rem', color: '#666' }}>Page not found</p>
				<a href="/" style={{ marginTop: '2rem', display: 'inline-block', padding: '0.75rem 1.5rem', backgroundColor: '#0076ff', color: 'white', borderRadius: '0.5rem', textDecoration: 'none' }}>
					Go Home
				</a>
			</div>
		</div>
	);
}

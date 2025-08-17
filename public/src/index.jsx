import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

function RegistrationForm() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  async function loadUsers() {
    setRefreshing(true);
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      if (res.ok && data.ok) {
        setUsers(data.users);
      } else {
        throw new Error(data.error || 'Falha ao carregar usuários');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  const onChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'Erro desconhecido');
      }
  setStatus({ type: 'success', message: `Usuário registrado: ${data.user.name} (ID ${data.user.id})` });
      setForm({ name: '', email: '', password: '' });
  loadUsers();
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <header>
        <h1>Marketplace - Cadastro</h1>
        <p>Crie sua conta para começar a comprar e vender.</p>
      </header>
  <main>
        {status && (
          <div className={`alert ${status.type} fade-in`} role="alert">
            <span>{status.message}</span>
          </div>
        )}
        <form onSubmit={onSubmit}>
          <div>
            <label htmlFor="name">Nome</label>
            <input id="name" name="name" value={form.name} onChange={onChange} placeholder="Seu nome" required />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input id="email" type="email" name="email" value={form.email} onChange={onChange} placeholder="voce@exemplo.com" required />
          </div>
          <div>
            <label htmlFor="password">Senha</label>
            <input id="password" type="password" name="password" value={form.password} onChange={onChange} placeholder="••••••••" required />
            <small className="helper">Mínimo 6 caracteres.</small>
          </div>
          <button type="submit" disabled={loading}>{loading ? 'Registrando...' : 'Registrar'}</button>
        </form>
        <section style={{marginTop:'2.5rem'}}>
          <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: '.75rem'}}>
            <h2 style={{margin:0, fontSize:'1.25rem'}}>Usuários Recentes</h2>
            <button type="button" onClick={loadUsers} disabled={refreshing} style={{background:'#6366f1', padding:'.55rem .9rem', fontSize:'.8rem'}}>
              {refreshing ? 'Atualizando...' : 'Atualizar'}
            </button>
          </div>
          <div style={{overflowX:'auto'}}>
            <table style={{width:'100%', borderCollapse:'collapse', fontSize:'.9rem'}}>
              <thead>
                <tr style={{textAlign:'left', background:'#f1f5f9'}}>
                  <th style={{padding:'.6rem .7rem'}}>ID</th>
                  <th style={{padding:'.6rem .7rem'}}>Nome</th>
                  <th style={{padding:'.6rem .7rem'}}>Email</th>
                  <th style={{padding:'.6rem .7rem'}}>Criado</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 && (
                  <tr>
                    <td colSpan={4} style={{padding:'1rem .7rem', textAlign:'center', color:'#64748b'}}>Nenhum usuário registrado ainda.</td>
                  </tr>
                )}
                {users.map(u => (
                  <tr key={u.id} style={{borderTop:'1px solid #e2e8f0'}}>
                    <td style={{padding:'.55rem .7rem', fontVariantNumeric:'tabular-nums'}}>{u.id}</td>
                    <td style={{padding:'.55rem .7rem'}}>{u.name}</td>
                    <td style={{padding:'.55rem .7rem'}}>{u.email}</td>
                    <td style={{padding:'.55rem .7rem'}}>{new Date(u.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
      <footer>
        &copy; {new Date().getFullYear()} Marketplace Demo.
      </footer>
    </>
  );
}

createRoot(document.getElementById('root')).render(<RegistrationForm />);

const base = 'http://localhost:3000';

async function run() {
  try {
    console.log('1) Registering user...');
    let res = await fetch(`${base}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: 'Dev Test', email: 'devtest@example.com', password: 'Password123', username: 'devtest' })
    });
    let json = await res.json().catch(()=>({}));
    console.log('Register status', res.status, json);

    console.log('2) Logging in...');
    res = await fetch(`${base}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'devtest@example.com', password: 'Password123' })
    });
    json = await res.json();
    console.log('Login status', res.status, json.message || json);
    if (!json.token) {
      console.error('No token received, aborting');
      process.exit(1);
    }
    const token = json.token;

    console.log('3) Creating pedido with token...');
    const pedidoBody = {
      items: [ { id: 1, nombre: 'Hamburguesa', cantidad: 2, precio: 500 }, { id: 2, nombre: 'Refresco', cantidad: 1, precio: 150 } ],
      total: 1150,
      metodo_pago: 'tarjeta'
    };
    res = await fetch(`${base}/api/pedidos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
      body: JSON.stringify(pedidoBody)
    });
    json = await res.json();
    console.log('Crear pedido status', res.status, json);

  } catch (err) {
    console.error('Error in flow:', err);
    process.exit(1);
  }
}

run();

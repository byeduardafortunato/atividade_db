const form = document.getElementById("form");
const lista = document.getElementById("lista");
const totalEl = document.getElementById("total");
const formLogin = document.getElementById("formLogin");

// Carrega usuários e atualiza total
async function carregarUsuarios() {
  try {
    const resp = await fetch("/usuarios");
    const usuarios = await resp.json();
    lista.innerHTML = "";
    usuarios.forEach((u) => {
      const li = document.createElement("li");

      const span = document.createElement("span");
      span.textContent = `${u.nome} (${u.email})`;
      span.style.cursor = "pointer";
      span.title = "Clique para ver detalhes";
      span.addEventListener("click", () => {
        alert(`Nome: ${u.nome}\nEmail: ${u.email}`);
      });

      const botaoRemover = document.createElement("button");
      botaoRemover.textContent = "❌";
      botaoRemover.addEventListener("click", async () => {
        if (confirm(`Deseja realmente remover ${u.nome}?`)) {
          const r = await fetch(`/usuarios/${u.id}`, { method: "DELETE" });
          if (r.ok) {
            carregarUsuarios();
            atualizarTotal();
          } else {
            alert("Erro ao remover usuário.");
          }
        }
      });

      li.appendChild(span);
      li.appendChild(botaoRemover);
      lista.appendChild(li);
    });
  } catch (err) {
    console.error("Erro ao carregar usuários:", err);
  }
}

// Atualiza o contador de usuários
async function atualizarTotal() {
  try {
    const r = await fetch("/total");
    const data = await r.json();
    totalEl.textContent = data.total ?? 0;
  } catch (err) {
    console.error("Erro ao obter total:", err);
    totalEl.textContent = "0";
  }
}

// Enviar novo usuário (manter funcionalidade)
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const nome = document.getElementById("nome").value.trim();
  const email = document.getElementById("email").value.trim();
  if (!nome || !email) {
    alert("Preencha todos os campos!");
    return;
  }

  try {
    const r = await fetch("/usuarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, email }),
    });
    if (r.ok) {
      form.reset();
      await carregarUsuarios();
      await atualizarTotal();
    } else {
      alert("Erro ao cadastrar usuário.");
    }
  } catch (err) {
    console.error("Erro no cadastro:", err);
  }
});

// Login simples — envia email e verifica existência
formLogin.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value.trim();
  if (!email) {
    alert("Digite um email para login.");
    return;
  }

  try {
    const r = await fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (r.status === 404) {
      const data = await r.json();
      alert(data.message || "Usuário inexistente.");
    } else if (r.ok) {
      const data = await r.json();
      const u = data.user;
      alert(`Bem-vindo(a), ${u.nome}!\nEmail: ${u.email}`);
    } else {
      alert("Erro no login.");
    }
  } catch (err) {
    console.error("Erro no login:", err);
  }
});

// Inicializa
carregarUsuarios();
atualizarTotal();
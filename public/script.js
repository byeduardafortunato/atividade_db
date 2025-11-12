const form = document.getElementById("form");
const lista = document.getElementById("lista");

// Função para carregar usuários do servidor
async function carregarUsuarios() {
  const resposta = await fetch("/usuarios");
  const usuarios = await resposta.json();

  // Limpa lista antes de recriar
  lista.innerHTML = "";

  // Mostra no console (pra depurar)
  console.log(usuarios);

  usuarios.forEach((u) => {
    const li = document.createElement("li");

    // Nome e email juntos
    const span = document.createElement("span");
    span.textContent = `${u.nome} (${u.email})`;
    span.style.cursor = "pointer";
    span.addEventListener("click", () => {
      alert(`Nome: ${u.nome}\nEmail: ${u.email}`);
    });

    // Botão de remover
    const botaoRemover = document.createElement("button");
    botaoRemover.textContent = "❌";
    botaoRemover.style.marginLeft = "10px";
    botaoRemover.addEventListener("click", async () => {
      if (confirm(`Deseja realmente remover ${u.nome}?`)) {
        const resposta = await fetch(`/usuarios/${u.id}`, { method: "DELETE" });
        if (resposta.ok) {
          carregarUsuarios();
        } else {
          alert("Erro ao remover usuário!");
        }
      }
    });

    li.appendChild(span);
    li.appendChild(botaoRemover);
    lista.appendChild(li);
  });
}

// Cadastrar novo usuário
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const email = document.getElementById("email").value.trim();

  if (!nome || !email) {
    alert("Preencha todos os campos!");
    return;
  }

  await fetch("/usuarios", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, email }),
  });

  form.reset();
  carregarUsuarios();
});

// Carregar ao iniciar
carregarUsuarios();
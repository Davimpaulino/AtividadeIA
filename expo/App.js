/* =====================================================
   APP EXPO SNACK - CLIENTES
   Consome a API REST publicada no Render.

   1. Abra https://snack.expo.dev
   2. Cole este código no App.js
   3. Troque SEU-PROJETO pela URL do seu serviço no Render
===================================================== */

import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
  SafeAreaView,
  KeyboardAvoidingView,
} from "react-native";

const API_URL = "https://SEU-PROJETO.onrender.com/api/clientes";

// Confirmação que funciona no celular e na versão Web do Snack
function confirmar(mensagem, aoConfirmar) {
  if (Platform.OS === "web") {
    if (window.confirm(mensagem)) aoConfirmar();
    return;
  }
  Alert.alert("Confirmação", mensagem, [
    { text: "Cancelar", style: "cancel" },
    { text: "Excluir", style: "destructive", onPress: aoConfirmar },
  ]);
}

function avisar(titulo, mensagem) {
  if (Platform.OS === "web") window.alert(`${titulo}\n${mensagem}`);
  else Alert.alert(titulo, mensagem);
}

export default function App() {
  const [clientes, setClientes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro] = useState("");

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  const [salvando, setSalvando] = useState(false);

  /* LISTAR - GET /api/clientes */
  const carregarClientes = useCallback(async () => {
    try {
      setErro("");
      const resposta = await fetch(API_URL);
      if (!resposta.ok) throw new Error("Erro HTTP: " + resposta.status);
      const dados = await resposta.json();
      console.log("Clientes:", dados);
      setClientes(dados);
    } catch (error) {
      console.log("Erro:", error);
      setErro(error.message);
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  }, []);

  useEffect(() => {
    carregarClientes();
  }, [carregarClientes]);

  function limparFormulario() {
    setNome("");
    setEmail("");
    setEditandoId(null);
  }

  /* CADASTRAR (POST) ou ALTERAR (PUT) */
  async function salvar() {
    if (!nome.trim() || !email.trim()) {
      avisar("Atenção", "Preencha nome e e-mail.");
      return;
    }
    setSalvando(true);
    try {
      const url = editandoId ? `${API_URL}/${editandoId}` : API_URL;
      const resposta = await fetch(url, {
        method: editandoId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email }),
      });
      const dados = await resposta.json();
      if (!resposta.ok) throw new Error(dados.erro || "Erro ao salvar.");
      limparFormulario();
      await carregarClientes();
    } catch (error) {
      avisar("Erro", error.message);
    } finally {
      setSalvando(false);
    }
  }

  /* EXCLUIR - DELETE /api/clientes/:id */
  function excluir(cliente) {
    confirmar(`Excluir ${cliente.nome}?`, async () => {
      try {
        const resposta = await fetch(`${API_URL}/${cliente.id}`, { method: "DELETE" });
        const dados = await resposta.json();
        if (!resposta.ok) throw new Error(dados.erro || "Erro ao excluir.");
        if (editandoId === cliente.id) limparFormulario();
        await carregarClientes();
      } catch (error) {
        avisar("Erro", error.message);
      }
    });
  }

  function editar(cliente) {
    setEditandoId(cliente.id);
    setNome(cliente.nome);
    setEmail(cliente.email);
  }

  /* TELA DE CARREGAMENTO */
  if (carregando) {
    return (
      <View style={[styles.container, styles.centro]}>
        <ActivityIndicator size="large" color="#1f6feb" />
        <Text style={styles.mensagem}>Carregando clientes...</Text>
        <Text style={styles.detalhe}>
          No plano gratuito o Render pode levar até 1 minuto para "acordar".
        </Text>
      </View>
    );
  }

  /* TELA DE ERRO */
  if (erro && !clientes.length) {
    return (
      <View style={[styles.container, styles.centro]}>
        <Text style={styles.titulo}>Erro</Text>
        <Text style={styles.erro}>Não foi possível carregar os clientes.</Text>
        <Text style={styles.detalhe}>{erro}</Text>
        <TouchableOpacity
          style={[styles.botao, { marginTop: 20 }]}
          onPress={() => {
            setCarregando(true);
            carregarClientes();
          }}
        >
          <Text style={styles.botaoTexto}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const cabecalho = (
    <View>
      <Text style={styles.titulo}>Clientes</Text>
      <Text style={styles.subtitulo}>
        {clientes.length} cliente(s) cadastrado(s) na API
      </Text>

      <View style={styles.form}>
        <Text style={styles.formTitulo}>
          {editandoId ? `Editar cliente #${editandoId}` : "Novo cliente"}
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Nome"
          value={nome}
          onChangeText={setNome}
        />
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TouchableOpacity
          style={[styles.botao, editandoId && styles.botaoVerde]}
          onPress={salvar}
          disabled={salvando}
        >
          <Text style={styles.botaoTexto}>
            {salvando ? "Salvando..." : editandoId ? "Atualizar" : "Cadastrar"}
          </Text>
        </TouchableOpacity>
        {editandoId && (
          <TouchableOpacity style={styles.botaoCancelar} onPress={limparFormulario}>
            <Text style={styles.botaoCancelarTexto}>Cancelar</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <FlatList
          data={clientes}
          keyExtractor={(item) => String(item.id)}
          ListHeaderComponent={cabecalho}
          contentContainerStyle={styles.lista}
          refreshing={atualizando}
          onRefresh={() => {
            setAtualizando(true);
            carregarClientes();
          }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={{ flex: 1 }}>
                <Text style={styles.id}>ID {item.id}</Text>
                <Text style={styles.nome}>{item.nome}</Text>
                <Text style={styles.email}>{item.email}</Text>
              </View>
              <View style={styles.acoes}>
                <TouchableOpacity style={styles.acaoEditar} onPress={() => editar(item)}>
                  <Text style={styles.acaoTexto}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.acaoExcluir} onPress={() => excluir(item)}>
                  <Text style={[styles.acaoTexto, { color: "#fff" }]}>Excluir</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.vazio}>Nenhum cliente cadastrado.</Text>
          }
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f4f7",
    paddingTop: Platform.OS === "android" ? 35 : 0,
  },
  centro: {
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  lista: {
    padding: 20,
    paddingBottom: 40,
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111",
  },
  subtitulo: {
    fontSize: 15,
    color: "#666",
    marginTop: 4,
    marginBottom: 16,
  },
  form: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e5ea",
    marginBottom: 20,
  },
  formTitulo: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#cfd4dc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 10,
    backgroundColor: "#fafbfc",
  },
  botao: {
    backgroundColor: "#1f6feb",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  botaoVerde: {
    backgroundColor: "#1a7f37",
  },
  botaoTexto: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  botaoCancelar: {
    alignItems: "center",
    paddingVertical: 10,
    marginTop: 6,
  },
  botaoCancelarTexto: {
    color: "#666",
    fontSize: 15,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e5ea",
    flexDirection: "row",
    alignItems: "center",
  },
  id: {
    fontSize: 12,
    color: "#888",
    marginBottom: 2,
  },
  nome: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111",
  },
  email: {
    fontSize: 15,
    color: "#555",
    marginTop: 2,
  },
  acoes: {
    marginLeft: 10,
  },
  acaoEditar: {
    backgroundColor: "#f5c518",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginBottom: 6,
    alignItems: "center",
  },
  acaoExcluir: {
    backgroundColor: "#d1242f",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  acaoTexto: {
    fontWeight: "bold",
    fontSize: 13,
    color: "#111",
  },
  mensagem: {
    marginTop: 15,
    fontSize: 16,
  },
  erro: {
    fontSize: 17,
    color: "#d1242f",
    marginTop: 10,
    textAlign: "center",
  },
  detalhe: {
    marginTop: 10,
    color: "#666",
    textAlign: "center",
  },
  vazio: {
    textAlign: "center",
    marginTop: 30,
    color: "#777",
  },
});

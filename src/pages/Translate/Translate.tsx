import "./Translate.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import back from "../../assets/icons/back.png";

export function TranslateEpub() {
  const [file, setFile] = useState<File | null>(null);
  const [sendMessage, setSendMessage] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    setSendMessage(true);

    if (!file) return alert("Selecione um arquivo primeiro!");

    const formData = new FormData();
    formData.append("file", file);

    await fetch("http://localhost:8000/upload", {
      method: "POST",
      body: formData,
    });

    await baixarEpub(file.name);
  }

  const baixarEpub = async (filename: string) => {
    const response = await fetch(`http://localhost:8000/download/${filename}`);

    if (!response.ok) {
      alert("Erro ao baixar arquivo");
      return;
    }

    const arrayBuffer = await response.arrayBuffer();

    const blob = new Blob([arrayBuffer], { type: "application/epub+zip" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}`;
    document.body.appendChild(a);
    a.click();
    a.remove();

  };

  return (
    <div id="translate-body">
      <div id="translate-welcome">

        <div id="back-icon-scope">
          <img src={back} alt="" id="back-icon" onClick={() => navigate('/')} />
        </div>

        <div id="translate-welcome-text">
          <h1>
            <span>Traduza</span> agora seus livros e ultrapasse as <span>barreiras</span> <span>linguisticas</span> em segundos!
          </h1>
        </div>
      </div>

      <div id="translate-main">
        <div id="translate-main-content">
          <h1>Escolha seu Livro original</h1>
          <input type="file" accept=".epub" onChange={handleChange} />
          <button onClick={handleUpload} id="translate-upload-button">Enviar e Baixar Traduzido</button>
          {sendMessage && <p id="translate-wait-message">Nossos poliglotas já estão traduzindo seu livro! se divirta enquanto isso.</p>}

        </div>


      </div>
    </div>
  );
}


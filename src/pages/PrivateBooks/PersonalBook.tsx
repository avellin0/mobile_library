import { Reader } from "../EpubJS/MyEbook";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import back from "../../assets/icons/back.png";
import write from "../../assets/icons/write.png";

import './personalBook.css'

interface MobileProps {
    mobile: boolean;
}

export function PersonalBooks({ mobile }: MobileProps) {
    const [file, setfile] = useState<string | null>(null)
    const [header, setHeader] = useState(true)
    const [notes, setNotes] = useState(false)
    const [texto, setTexto] = useState<string>("");

    const navigate = useNavigate()

    const [width, setWidth] = useState("100vw")

    const objectUrl = useRef<string | null>(null)

    useEffect(() => {
        if (objectUrl.current) {
            URL.revokeObjectURL(objectUrl.current)
            objectUrl.current = null
        }
    }, [])

    const handleUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return

        const reader = new FileReader()

        reader.onload = () => {
            const data = reader.result as string
            setfile(data)
        }


        reader.readAsDataURL(file);
        setHeader(false)
    }

    const handleSalvar = () => {
        const blob = new Blob([texto], { type: "text/plain" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "meu_arquivo.txt";
        link.click();
        URL.revokeObjectURL(link.href);
    };


    const handleNotes = () => {
        setWidth("80vw")

        if (notes) {
            setWidth("100vw")
            return setNotes(false)
        }

        setNotes(true)
    }


    return (
        <>
            <div id="reader-body">

                <div>
                    {header ? (
                        <div id="reader-header">
                            <h1>Selecione seu Livro Epub</h1>
                            <input type="file" accept="application/epub+zip" onChange={handleUrl} />
                        </div>
                    ) : (
                        <div id={width === "100vw" ? "reader-header-deactive" : "reader-header-active"}>

                            <div id="reader-settings">
                                {!mobile && <img src={write} alt="" className="icon" onClick={handleNotes} />}
                                <img src={back} alt="" className="icon" onClick={() => navigate("/")} />

                            </div>

                            {width === "80vw" && notes ? (
                                <div id="reader-scope">
                                    <textarea id="reader-notes" spellCheck="false" placeholder="Deixe sua mente livre..." onChange={(e) => setTexto(e.target.value)} />
                                    <button id="save-notes" onClick={handleSalvar}>Salvar</button>
                                </div>
                            ) : ""}
                        </div>
                    )}
                </div>

                <div>
                    {file && <Reader url={file} width={width} />}

                </div>
            </div>

        </>
    )
}
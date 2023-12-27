// src/api.js

const API_URL = process.env.REACT_APP_API_URL;
const API_KEY = process.env.OPENAI_API_KEY;  // Considera di spostare questo in una variabile d'ambiente

const getChatResponse = async (userText) => {
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${API_KEY}`},
        body: JSON.stringify({
            model: "text-davinci-003",
            prompt: userText,
            max_tokens: 2048,
            temperature: 0.2,
            n: 1,
            stop: null
        })
    };

    try {
        const response = await fetch(API_URL, requestOptions);
        const data = await response.json();
        return data.choices[0].text.trim();
    } catch (error) {
        console.error("Errore durante la chiamata API:", error);
        throw error;  // Rilancia l'errore per un ulteriore handling nel componente
    }
};
/**
 * Create an assistant API call
 * @param {string} name 
 * @param {string} model 
 * @param {string} instructions 
 * @param {array(objects)} tools 
 * @param {array} file_ids 
 */
const createAssistant = async (name, model, instructions, tools, file_ids ) => {
    await fetch(`${API_URL}/api/openai/create-assistant`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem('accessToken')}` },
        body: JSON.stringify(
            {
                "name": name,
                "model": model? model : "gpt-4-1106-preview",
                "instructions": instructions,
                "tools": [
                  {
                    "type": "code_interpreter"
                  }
                ],
                "file_ids": []
              }
        )
    }).then(
        res => res.json()
    ).catch(
        err => console.error(err)
    );
}
/**
 * upload a file to openAI
 * @param {file} file 
 */
const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    await fetch(`${API_URL}/api/openai/upload-file`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${localStorage.getItem('accessToken')}` },
        body: formData
    }).then(
        res => res.json()
    ).catch(
        err => console.error(err)
    );
};
/**
 * Create a thread API call
 */
const createThread = async () => {
    await fetch(`${API_URL}/api/openai/create-thread`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${localStorage.getItem('accessToken')}` }
    }).then(
        res => res.json()
    ).catch(
        err => console.error(err)
    );
};
/**
 * Create message API call
 * @param {*} thread_id 
 * @param {*} content 
 * @param {*} file_ids 
 */
const createMessage = async (thread_id, content, file_ids) => {
    await fetch(`${API_URL}/api/openai/create-message`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${localStorage.getItem('accessToken')}` },
        body: JSON.stringify(
            {
                "thread_id" : thread_id,
                "role": "user",
                "content": content,
                "file_ids": file_ids
            }
        )
    }).then(
        res => res.json()
    ).catch(
        err => console.error(err)
    );
};

const createRun = async (thread_id, assistant_id) => {
    await fetch(`${API_URL}/api/openai/create-run`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${localStorage.getItem('accessToken')}` },
        body: JSON.stringify(
            {
                "thread_id": thread_id,
                "assistant_id": assistant_id
            }
        )
    }).then(
        res => res.json()
    ).catch(
        err => console.error(err)
    );
}

const openAIApi = {
    getChatResponse,
    createAssistant,
    uploadFile,
    createThread,
    createMessage,
    createRun
};

export default openAIApi;
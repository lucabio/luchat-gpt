const express = require('express');
const OpenAI = require("openai");
const fs = require('fs');
const { generateBlobUrl, upload } = require('../../utils/utility');
const { saveAssistants, saveThreads } = require('../../persistence/dbOperations');
const checkToken = require('../../middleware/checkToken');
const router = express.Router();

// Configure OpenAI SDK
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

router.post('/create-assistant', checkToken, async (req, res) => {
try {
    const { instructions, name, tools, model, file_ids } = req.body;

    console.log(req.body);

    if (!instructions || !name) {
        return res.status(400).send("Missing data for assistant creation.");
    }

    // Using the OpenAI SDK to create an assistant
    const response = await openai.beta.assistants.create({
        instructions: instructions,
        name: name,
        tools: tools,
        file_ids: file_ids,
        model: model || 'gpt-4',
    });
    
    await saveAssistants(response.id, req.user.Username);

    res.json(response);
} catch (error) {
    console.error(error);
    res.status(500).send("Error during assistant creation.");
}
});


router.post('/upload-file', checkToken, upload.single('file'), async (req, res) => {
    try {
        console.log(`request incoming: ${req.file}`);
        const userId = req.user.Username;

        // Generate a blob url after uploading the file to S3
        /**
         * at the moment blobrl is not used but it can be used to show the uploaded file
         */
        const blobUrl = await generateBlobUrl(req.file.path, userId);

        const response = await openai.files.create({
            purpose: 'assistants',
            file: fs.createReadStream(req.file.path),
        });

         res.json({ message: "File loaded successfully", response: response.data });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error during file upload.");
    }
});

router.get('/list-files', checkToken, async (req, res) => {
    try {
        const response = await openai.files.list({
            purpose: 'assistants',
        });

        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).send("Errore durante la lettura dei file");
    }
});

router.get('/create-thread', checkToken, async (req, res) => {
    try {
        
        const response = await openai.beta.threads.create();

        await saveThreads(response.id, req.user.Username);

        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error during thread creation.");
    }
});

router.post('/create-message', checkToken, async (req, res) => {
    try {
        const { thread_id, content, role, file_ids} = req.body;
        console.log(`create message request incoming: ${JSON.stringify(req.body)}`)

        if (!thread_id || !content) {
            return res.status(400).send("Missing data for message creation.");
        }

        const response = await openai.beta.threads.messages.create(
            thread_id,
            {
                role: role || 'user',
                content: content,
                file_ids: file_ids
            }
        );

        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error during message creation.");
    }
});

router.get('/retrieve-messages', checkToken, async (req, res) => {
    try {
        const { thread_id, msg_id } = req.body;

        if (!thread_id) {
            return res.status(400).send("Missing thread id.");
        }

        const response = await openai.beta.threads.messages.retrieve(thread_id, msg_id);

        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error during message retrieval.");
    }
});

router.get('/list-messages', checkToken, async (req, res) => {
    try {
        const { thread_id} = req.body;

        if (!thread_id) {
            return res.status(400).send("Missing thread id.");
        }

        const response = await openai.beta.threads.messages.list(thread_id);

        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error during message list.");
    }
});

router.post('/create-run', checkToken, async (req, res) => {
    try{
        const { thread_id, assistant_id } = req.body;

        if (!thread_id) {
            return res.status(400).send("Missing thread id.");
        }

        const response = await openai.beta.threads.runs.create(
            thread_id,
            {
                assistant_id: assistant_id
            }
        );

        res.json(response);
    }catch (error) {
        console.error(error);
        res.status(500).send("Error during runs create.");
    }
});

router.get('/retrieve-run', checkToken, async (req, res) => {
    try{
        const { thread_id, run_id } = req.body;

        if (!thread_id) {
            return res.status(400).send("Missing thread id.");
        }

        const response = await openai.beta.threads.runs.retrieve(thread_id, run_id);

        res.json(response);
    }catch (error) {
        console.error(error);
        res.status(500).send("Error during runs retrieve.");
    }
});

router.get('/list-runs', checkToken, async (req, res) => {
    try{
        const { thread_id, run_id } = req.body;

        if (!thread_id) {
            return res.status(400).send("Missing thread id.");
        }

        const response = await openai.beta.threads.runs.list(thread_id, run_id);

        res.json(response);
    }catch (error) {
        console.error(error);
        res.status(500).send("Error during runs list.");
    }
});


module.exports = router;


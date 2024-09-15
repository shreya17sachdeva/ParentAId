//these are used to explicitely define the different requests which can be used no to hard code it each time

const Query = require('../models/queryModel');
const mongoose = require('mongoose');

//get all query
const getQueries = async (req,res) => {
    const user_id = req.user._id

    const queries = await Query.find({ user_id }).sort({createdAt: -1})

    res.status(200).json(queries)
}

//get a single query
const getQuery = async (req,res) => {
    const { id } = req.params

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such Query'})
    }

    const query = await Query.findById(id)

    if(!query) {
        return res.status(404).json({error: 'No such Query'})
    }

    res.status(200).json(query)
}

//create a query
const createQuery = async (req,res) => {
    const { question, answer } = req.body

    let emptyFields = []

    if(!question) {
        emptyFields.push('question')
    }

    if(!answer) {
        emptyFields.push('answer')
    }

    if(emptyFields.length > 0) {
        return res.status(400).json({error: 'Please fill in all fields', emptyFields})
    }
    //add doc to db
    try {
        const user_id = req.user._id
        const query = await Query.create({ question, answer, user_id})
        res.status(200).json(query)
    }
    catch (error) {
        res.status(400).json({error: error.message})
    }
}

//delete a query
const deleteQuery = async (req,res) => {
    const { id } = req.params

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such Query'})
    }

    const query = await Query.findOneAndDelete({_id: id})

    if(!query) {
        return res.status(400).json({error: 'No such Query'})
    }

    res.status(200).json(query)
}

//update a query
const updateQuery = async (req,res) => {
    const { id } = req.params

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such Query'})
    }

    const query = await Query.findOneAndUpdate({_id: id}, {
        ...req.body
    })

    
    if(!query) {
        return res.status(400).json({error: 'No such Query'})
    }

    res.status(200).json(query)
}

// Dynamic import for node-fetch
const fetchAnswer = async (req, res) => {
    console.log('fetchAnswer function called');
    const { question } = req.body;

    // Use dynamic import for node-fetch
    const fetch = (await import('node-fetch')).default;

    if (!question) {
        console.log('No question provided');
        return res.status(400).json({ error: "Question is required" });
    }

    console.log('Question received:', question);

    // Debug: Check if API key is loaded
    console.log('API Key:', process.env.GROQ_API_KEY ? 'Loaded' : 'Not loaded');

    try {
        console.log('Sending request to Groq API...');
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
            },
            body: JSON.stringify({
                messages: [
                    {
                        role: "system",
                        content: "Your role is to act as a parent tutor, assisting parents in answering complex questions from their children and providing engaging explanations about the world. I will adjust my language and complexity to be age-appropriate, using simpler terms for younger children and introducing more advanced concepts for older ones. All information provided will be scientifically accurate and up-to-date, and when discussing evolving or controversial topics, I will present balanced viewpoints to encourage critical thinking. To make learning interactive and engaging, I will suggest hands-on activities, experiments, and real-world analogies that children can relate to, as well as recommend age-appropriate resources such as books, videos, and websites for further exploration. I will be culturally sensitive, offering diverse perspectives and examples while respecting different backgrounds and beliefs. Safety and ethics will be a priority, ensuring that all suggested activities are safe and promote ethical behavior. When addressing emotionally sensitive topics, I will guide parents on how to discuss these in a comforting and reassuring manner, considering the emotional aspects of children's questions. I aim to support parents by providing tips to extend learning beyond the initial question and suggesting ways to turn curiosity into teachable moments. I will encourage creativity, imagination, and interdisciplinary connections by showing how topics link to various fields like science, history, and art. Flexibility is key; I will offer both quick, concise answers for immediate use and detailed explanations for when more time is available. I will also emphasize positive reinforcement, encouraging parents to praise their child's curiosity and critical thinking. Recognizing the importance of resource accessibility, I will suggest a range of resources, from free online materials to common household items for experiments. When questions are unclear, I will provide guidance on how parents might seek clarification. Ultimately, my goal is to empower parents with the knowledge and techniques to foster their children's curiosity, promote a love for learning, and strengthen the parent-child bond through educational interactions.",
                    },
                    {
                        role: "user",
                        content: question,
                    },
                ],
                model: "mixtral-8x7b-32768",
            }),
        });

        // Debug: Log the response status and body
        console.log('Response status:', response.status);
        const responseBody = await response.text();
        console.log('Response body:', responseBody);

        if (!response.ok) {
            console.log('Error response from API');
            return res.status(response.status).json({ error: `Failed to fetch answer: ${responseBody}` });
        }

        const data = JSON.parse(responseBody);
        console.log('Parsed data:', data);

        if (data.choices && data.choices.length > 0 && data.choices[0].message) {
            const answer = data.choices[0].message.content;
            console.log('Answer:', answer);
            res.status(200).json({ answer: answer });
        } else {
            console.log('Unexpected response structure:', data);
            res.status(500).json({ error: 'Unexpected response structure from API' });
        }
    } catch (error) {
        console.error('Error details:', error);
        res.status(500).json({ error: 'Something went wrong', details: error.message });
    }
};


module.exports = {
    createQuery,
    getQueries,
    getQuery,
    deleteQuery,
    updateQuery,
    fetchAnswer 
}
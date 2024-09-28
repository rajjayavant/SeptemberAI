import { Client } from "@gradio/client";

const fetchResponse = async (client, prompt) => {
    try {
        const result = await client.predict("/chat", {
            message: prompt,
        });
        console.log(result.data);
        return result.data[0]; 
    } catch (error) {
        console.error("Error in fetchResponse:", error);
        throw error; 
    }
};

export default fetchResponse;
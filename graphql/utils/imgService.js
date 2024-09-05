const fetchImage = async (url) => {
    const img = await fetch('http://imgServer:3000/img/' + url);

    if (!img.ok) {
        console.error(`Error fetching image: ${img.statusText}`);
        return {
            image: ""
        }
    }
    
    const arrBuffer = await img.arrayBuffer();
    const buffer = Buffer.from(arrBuffer); 
    const base64 = buffer.toString('base64');

    return {
        image: base64
    }
}

export default fetchImage;
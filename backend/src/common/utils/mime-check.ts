export const isMediaFile = (mimetype: string) => {
    return mimetype.startsWith('image/') || mimetype.startsWith('video/') || mimetype.startsWith('audio/');
};

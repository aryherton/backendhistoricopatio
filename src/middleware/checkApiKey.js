export const checkApiKey = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey) return res.status(404).json({ message: "No apiKey provided." });

  if (apiKey != process.env.SECRET_API_KEY)
    return res.status(401).json({ message: "Authenticate unauthorized." });
  else next();
};

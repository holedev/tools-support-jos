const INDENT_SIZE = 2;

export const formatHtml = (html: string): string => {
  try {
    let formatted = "";
    let indent = 0;

    // Split on tags but keep the tags
    const tokens = html.split(/(<\/?[^>]+>)/);

    for (const token of tokens) {
      if (!token.trim()) continue;

      // Check if it's a closing tag
      if (token.startsWith("</")) {
        indent -= INDENT_SIZE;
        formatted += `${" ".repeat(Math.max(0, indent))}${token}\n`;
      }
      // Check if it's an opening tag
      else if (token.startsWith("<")) {
        formatted += `${" ".repeat(indent)}${token}\n`;
        // Don't indent for self-closing or specific tags
        if (!token.endsWith("/>") && !token.match(/<(br|hr|img|input|link|meta)\s?[^>]*>/i)) {
          indent += INDENT_SIZE;
        }
      }
      // Text content
      else {
        const text = token.trim();
        if (text) {
          // Encode quotes in text content
          const encodedText = text.replace(/"/g, "&quot;");
          formatted += `${" ".repeat(indent)}${encodedText}\n`;
        }
      }
    }

    return formatted.trim();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Failed to format HTML");
  }
};

export const minifyHtml = (html: string): string => {
  try {
    // Split the HTML into tags and content to handle them separately
    const tokens = html.split(/(<[^>]+>)/);
    const processed = tokens.map((token) => {
      if (token.startsWith("<")) {
        return token
          .replace(/\s+/g, " ")
          .replace(/\s*([<>])\s*/g, "$1")
          .replace(/\s*(\/?>)\s*/g, "$1")
          .replace(/\s*=\s*/g, "=")
          .trim();
      }
      return token.replace(/"/g, "&quot;").replace(/\s+/g, " ").trim();
    });

    return processed.join("").replace(/>\s+</g, "><").replace(/\s+/g, " ").trim();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Failed to minify HTML");
  }
};

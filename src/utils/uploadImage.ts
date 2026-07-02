/**
 * Uploads an image file directly to ImgBB using the provided API Key.
 * Returns the hosted image URL.
 */
export async function uploadImageToImgBB(file: File): Promise<string> {
  const apiKey = "277db99c04187cbeac1df60f80005309";
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload image to ImgBB. Server returned status: " + response.status);
  }

  const result = await response.json();
  if (result.success && result.data && result.data.url) {
    return result.data.url;
  } else {
    throw new Error(result.error?.message || "Failed to upload image to ImgBB");
  }
}

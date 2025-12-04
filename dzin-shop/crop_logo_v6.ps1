
Add-Type -AssemblyName System.Drawing

$sourcePath = "C:\Users\bob\.gemini\antigravity\brain\fbbb9662-b93b-4b8d-adfe-7df5d0c89981\uploaded_image_1763975954315.png"
$destPath = "c:\Users\bob\Desktop\PROJECT DZIN\dzin-shop\public\logo.png"

# Load original image
$srcImage = [System.Drawing.Image]::FromFile($sourcePath)
$width = $srcImage.Width
$height = $srcImage.Height

# Crop the right 48.7% of the image (Between 48% and 49.05%)
$cropWidth = [int]($width * 0.487)
$cropX = $width - $cropWidth
$cropHeight = $height

$rect = New-Object System.Drawing.Rectangle $cropX, 0, $cropWidth, $cropHeight
$destImage = New-Object System.Drawing.Bitmap $cropWidth, $cropHeight
$graphics = [System.Drawing.Graphics]::FromImage($destImage)

# Draw the cropped portion
$graphics.DrawImage($srcImage, 0, 0, $rect, [System.Drawing.GraphicsUnit]::Pixel)

# Save directly to destination
$destImage.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)

# Cleanup
$srcImage.Dispose()
$destImage.Dispose()
$graphics.Dispose()

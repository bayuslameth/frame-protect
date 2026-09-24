from PIL import Image, ImageDraw
img = Image.new('RGB', (800, 600), color = (73, 109, 137))
d = ImageDraw.Draw(img)
d.text((10,10), "Test Image", fill=(255,255,0))
img.save('test_image.jpg')
print("Generated test_image.jpg")

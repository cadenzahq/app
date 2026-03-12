from PIL import Image, ImageDraw, ImageFont

def make_image(size, bg, text, color, fontsize, filename):
    img = Image.new("RGB", size, bg)
    draw = ImageDraw.Draw(img)

    font = ImageFont.truetype("arial.ttf", fontsize)

    bbox = draw.textbbox((0,0), text, font=font)
    x = (size[0] - (bbox[2]-bbox[0])) // 2
    y = (size[1] - (bbox[3]-bbox[1])) // 2

    draw.text((x,y), text, fill=color, font=font)
    img.save(filename)

# colors
dark = (32,40,60)
light = (245,245,245)
white = (255,255,255)

# profile images
make_image((1024,1024), dark, "Cadenza", white, 160, "cadenza_profile_dark.png")
make_image((1024,1024), light, "Cadenza", dark, 160, "cadenza_profile_light.png")

tag = "Modern management software for orchestras"

# covers
make_image((1584,396), dark, tag, white, 64, "cadenza_linkedin_cover.png")
make_image((1640,720), dark, tag, white, 72, "cadenza_facebook_cover.png")
make_image((2560,1440), dark, tag, white, 110, "cadenza_youtube_cover.png")
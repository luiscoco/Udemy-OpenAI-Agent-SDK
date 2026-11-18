from pathlib import Path
import json
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
from PIL import Image, ImageDraw
from pypdf import PdfReader
import pymupdf

apps = Path(__file__).resolve().parents[2]
assets = apps / "foundations-runtime" / "public" / "assets"
output = apps.parent / "output" / "pdf"
assets.mkdir(parents=True, exist_ok=True)
output.mkdir(parents=True, exist_ok=True)

image = Image.new("RGB", (720, 360), "#f5f7fc")
draw = ImageDraw.Draw(image)
draw.rectangle((80, 95, 240, 255), fill="#386dde")
draw.ellipse((300, 95, 460, 255), fill="#2c9d72")
draw.polygon([(565, 95), (645, 255), (485, 255)], fill="#eb9547")
image.save(assets / "classroom-shapes.png")

pdf_path = output / "classroom-workshop.pdf"
pdf = canvas.Canvas(str(pdf_path), pagesize=(595, 842))
pdf.setTitle("Classroom robotics workshop")
pdf.setFillColor(HexColor("#1d2541"))
pdf.setFont("Helvetica-Bold", 26)
pdf.drawString(52, 755, "Robotics workshop")
pdf.setFont("Helvetica", 12)
pdf.drawString(52, 725, "A beginner lesson for the school club")
pdf.setFillColor(HexColor("#7255bc"))
pdf.roundRect(52, 640, 491, 52, 8, fill=1, stroke=0)
pdf.setFillColor(HexColor("#ffffff"))
pdf.setFont("Helvetica-Bold", 13)
pdf.drawString(70, 661, "Duration 30 minutes  |  Audience Beginners")
pdf.setFillColor(HexColor("#1d2541"))
pdf.setFont("Helvetica-Bold", 16)
pdf.drawString(52, 590, "Workshop schedule")
for index, (duration, activity) in enumerate([("5 minutes", "Introduce the robot and its controls"), ("20 minutes", "Build and test a simple route"), ("5 minutes", "Demonstrate and reflect")]):
    y = 550 - index * 56
    pdf.setFont("Helvetica-Bold", 12)
    pdf.drawString(52, y, duration)
    pdf.setFont("Helvetica", 12)
    pdf.drawString(160, y, activity)
pdf.setFont("Helvetica-Bold", 16)
pdf.drawString(52, 340, "Materials")
pdf.setFont("Helvetica", 12)
pdf.drawString(52, 308, "Robotics kits and a projector")
pdf.setFillColor(HexColor("#748098"))
pdf.setFont("Helvetica", 10)
pdf.drawString(52, 70, "Agent Academy / teaching fixture / 12 November 2026")
pdf.save()
(assets / "classroom-workshop.pdf").write_bytes(pdf_path.read_bytes())
text = "\n".join(page.extract_text() for page in PdfReader(pdf_path).pages)
(assets / "classroom-workshop.txt").write_text(text, encoding="utf-8")
document = pymupdf.open(pdf_path)
document[0].get_pixmap(matrix=pymupdf.Matrix(1.5, 1.5)).save(assets / "classroom-workshop-preview.png")
(output / "classroom-workshop.png").write_bytes((assets / "classroom-workshop-preview.png").read_bytes())
assert len(document) == 1 and "20 minutes" in text and "Robotics kits" in text
print(json.dumps({"pdf": str(pdf_path), "pages": len(document), "textCharacters": len(text), "image": str(assets / "classroom-shapes.png")}))

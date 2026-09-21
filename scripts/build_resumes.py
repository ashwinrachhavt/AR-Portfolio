#!/usr/bin/env python3
"""Render the public resume variants from one editable source.

Run: uv run --with reportlab==4.4.10 --with pymupdf==1.27.2.3 python scripts/build_resumes.py
"""
import json
import shutil
from html import escape
from pathlib import Path

import pymupdf
import reportlab
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import HRFlowable, KeepTogether, Paragraph, SimpleDocTemplate, Spacer

ROOT = Path(__file__).resolve().parents[1]
DATA = json.loads((ROOT / "src/content/resume.json").read_text())
FONT_DIR = Path(reportlab.__file__).parent / "fonts"
for name, file in (("Resume", "Vera.ttf"), ("ResumeBold", "VeraBd.ttf")):
    pdfmetrics.registerFont(TTFont(name, str(FONT_DIR / file)))
pdfmetrics.registerFontFamily("Resume", normal="Resume", bold="ResumeBold")

INK = colors.HexColor("#17252c")
ACCENT = colors.HexColor("#214b61")
STYLES = {
    "name": ParagraphStyle("name", fontName="ResumeBold", fontSize=23, leading=27, textColor=INK, spaceAfter=4),
    "headline": ParagraphStyle("headline", fontName="ResumeBold", fontSize=10.2, leading=14, textColor=ACCENT, spaceAfter=5),
    "contact": ParagraphStyle("contact", fontName="Resume", fontSize=8.2, leading=12, textColor=INK, spaceAfter=2),
    "body": ParagraphStyle("body", fontName="Resume", fontSize=10, leading=13.2, textColor=INK, spaceAfter=3, alignment=TA_LEFT),
    "section": ParagraphStyle("section", fontName="ResumeBold", fontSize=10, leading=13, textColor=ACCENT, spaceBefore=9, spaceAfter=4, keepWithNext=True),
    "role": ParagraphStyle("role", fontName="ResumeBold", fontSize=10, leading=13.2, textColor=INK, spaceBefore=6, spaceAfter=3, keepWithNext=True),
    "bullet": ParagraphStyle("bullet", fontName="Resume", fontSize=10, leading=13.2, textColor=INK, leftIndent=10, firstLineIndent=-10, spaceAfter=4),
}


def p(text, style="body"):
    return Paragraph(text, STYLES[style])


def link(url, label):
    return f'<link href="{escape(url, quote=True)}" color="#214b61">{escape(label)}</link>'


def render(key, variant):
    output = ROOT / "public/resumes" / f"ashwin-rachha-{key}.pdf"
    output.parent.mkdir(parents=True, exist_ok=True)
    story = [p(escape(DATA["name"]), "name"), p(escape(variant["headline"]), "headline")]
    story += [p(f'{link("mailto:" + DATA["email"], DATA["email"])} · {escape(DATA["phone"])}', "contact")]
    story += [p(" · ".join(link(DATA[k], DATA[k].replace("https://", "")) for k in ("linkedin", "github", "website")), "contact")]
    story += [Spacer(1, 6), HRFlowable(width="100%", thickness=.7, color=ACCENT), Spacer(1, 7), p(escape(variant["summary"])), p("EXPERIENCE", "section")]
    md = [f'# {DATA["name"]}', variant["headline"], DATA["email"] + " | " + DATA["phone"], " | ".join(DATA[k] for k in ("linkedin", "github", "website")), variant["summary"], "## Experience"]
    for role in DATA["roles"]:
        selected = variant["selection"].get(role["id"])
        if not selected:
            continue
        header = f'{role["company"]} | {role["title"]} | {role["dates"]}'
        bullets = [role["bullets"][item] for item in selected]
        story.append(KeepTogether([p(escape(header), "role"), p("• " + escape(bullets[0]), "bullet")]))
        story.extend(p("• " + escape(b), "bullet") for b in bullets[1:])
        md += [f"### {header}"] + ["- " + b for b in bullets]
    story += [p("SKILLS", "section"), p(escape(variant["skills"])), p("EDUCATION & RESEARCH", "section")]
    md += ["## Skills", variant["skills"], "## Education & Research"]
    for school in DATA["education"]:
        text = f'{school["school"]} | {school["degree"]} | {school["dates"]} | GPA {school["gpa"]}'
        story.append(p(escape(text)))
        md.append(text)
    research = DATA["research"]
    story.append(p(f'<b>{escape(research["title"])}</b> — {escape(research["description"])} {link(research["thesis"], "Thesis")} · {link(research["code"], "Code")}'))
    md += [research["title"] + ": " + research["description"], research["thesis"], research["code"]]
    doc = SimpleDocTemplate(str(output), pagesize=letter, rightMargin=35, leftMargin=35, topMargin=28, bottomMargin=28, title=f'Ashwin Rachha — {variant["headline"]}', author=DATA["name"], pageCompression=1)
    doc.build(story)
    pdf = pymupdf.open(output)
    text = "\n".join(page.get_text() for page in pdf)
    if len(pdf) != 1:
        raise RuntimeError(f"{output.name}: expected 1 page, got {len(pdf)}; edit content/layout before publishing")
    for term in ("Loan Labs", "Finally", "50K+", "LangGraph", "Virginia Tech", "UNAR", "Outreach"):
        if term not in text:
            raise RuntimeError(f"{output.name}: missing extractable text: {term}")
    for page in pdf:
        for block in page.get_text("blocks"):
            if block[0] < 27 or block[1] < 20 or block[2] > 585 or block[3] > 769:
                raise RuntimeError(f"Text outside safe page bounds: {block[:4]}")
        uris = [item.get("uri", "") for item in page.get_links()]
        if DATA["github"] not in uris or DATA["linkedin"] not in uris:
            raise RuntimeError("Missing contact link annotation")
    (ROOT / "resumes").mkdir(exist_ok=True)
    (ROOT / "resumes" / f"{key}.md").write_text("\n\n".join(md) + "\n")
    print(f"Validated {output.name}: 1 page, {len(text.split())} words, {len(uris)} links")
    pdf.close()
    return output


if __name__ == "__main__":
    outputs = {key: render(key, value) for key, value in DATA["variants"].items()}
    # Keep the old public URL working and also provide the requested hyphenated URL.
    for name in ("ashwin_rachha_resume.pdf", "ashwin-rachha-resume.pdf"):
        shutil.copyfile(outputs["applied-ai"], ROOT / "public" / name)

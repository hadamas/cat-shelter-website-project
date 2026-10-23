# Gera web/public/patterns/patinhas.svg a partir dos SVGs desta pasta.
# Posição, rotação e tamanho de cada objeto ficam em layout.json:
#   [nome, x, y, rotação_em_graus, tamanho]   (o tile tem 640x640)
# Uso:  python design/pattern/make.py
import re, sys, json, io
import os
RAW=os.path.dirname(os.path.abspath(__file__))+'/'
def rnd(m):
    v=float(m.group()); t=f"{v:.1f}"
    t=t.rstrip('0').rstrip('.') if '.' in t else t
    return '0' if t in('-0','') else t
BB={'bone':[52,164,738,810],'fish':[60,291,722,674],'fishbone':[24,120,786,894],
    'food':[32,259,778,750],'paw':[44,168,766,894],'star':[112,227,698,786]}
defs=[]; syms=[]
for name in BB:
    s=open(RAW+name+'.svg').read()
    s=re.sub(r'<path fill="#ffffff"[^>]*/>','',s)  # remove o fundo branco do Canva
    body=re.sub(r'^.*?<svg[^>]*>','',s,flags=re.S).replace('</svg>','')
    d=re.search(r'<defs>(.*?)</defs>',body,re.S)
    if d:
        defs.append(d.group(1)); body=body.replace(d.group(0),'')
    body=re.sub(r'<g clip-path="url\(#[^)]*\)">\s*</g>','',body)
    body=re.sub(r' fill-opacity="1"','',body)
    if name=='food':
        body=body.replace('fill="#fdc795"','fill="#fff"').replace('fill="#f4ba84"','fill="#000"')
        defs.append(f'<mask id="m-food" maskUnits="userSpaceOnUse" x="0" y="0" width="810" height="1013">{body}</mask>')
        body='<rect x="0" y="0" width="810" height="1013" mask="url(#m-food)"/>'
    else:
        body=re.sub(r'fill="#[0-9a-fA-F]{6}"','',body)
    syms.append(f'<g id="{name}">{body}</g>')
defs_s=''.join(defs)
# remove the full-page clipPath usage (keeps content), harmless anyway
T=640
items=json.load(open(RAW+'layout.json'))
uses=[]
for name,x,y,r,size in items:
    x0,y0,x1,y1=BB[name]; cx,cy=(x0+x1)/2,(y0+y1)/2; k=size/max(x1-x0,y1-y0)
    h=size/2+4
    for dx in (-T,0,T):
        for dy in (-T,0,T):
            X,Y=x+dx,y+dy
            if X+h<0 or X-h>T or Y+h<0 or Y-h>T: continue
            uses.append(f'<use href="#{name}" transform="translate({X} {Y}) rotate({r}) scale({k:.4f}) translate({-cx:.0f} {-cy:.0f})"/>')
svg=(f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="{T}" height="{T}" viewBox="0 0 {T} {T}">'
     f'<defs>{defs_s}{"".join(syms)}</defs>{"".join(uses)}</svg>')
svg=re.sub(r'-?\d+\.\d+',rnd,svg)
open(os.path.join(RAW,'..','..','web','public','patterns','patinhas.svg'),'w').write(svg)
print('bytes',len(svg),'uses',len(uses))

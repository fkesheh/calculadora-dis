import { fnCalculaVento, fnCalculaVentoPoste, fnCalculaVentoTrafo, fnResultante, fnVetorTracao } from './calculos'


export const drawSetup = (sketch, w, h) => {
    sketch.createCanvas(w, h);
    sketch.background('black');
    sketch.noLoop()
  }

  export const drawLoop = (sketch, w, h, poste) => {
    let maxMod = 0
    let ts = []
    poste.forcas.forEach((p, i) => {
      let t = fnVetorTracao(p)
      ts.push(t)
      if (maxMod < t.mod) maxMod = t.mod
    })
    let vr = fnResultante(poste)
    if (maxMod < vr.mod) maxMod = vr.mod
    let vv = fnCalculaVento(poste, 60)
    let vp = fnCalculaVentoPoste(poste, 60)
    let vt = fnCalculaVentoTrafo(poste, 60)
    if (maxMod < (vv.mod + vp.mod + vt.mod)) maxMod = (vv.mod + vp.mod + vt.mod)
    let scale = maxMod / (w / 2 - 30)
    sketch.background('white');
    sketch.translate(h / 2, w / 2)
    sketch.fill(200)
    sketch.stroke(200)
    if (poste.modelo.classe == 'Duplo-T') {
      sketch.rect(5, -10, 10, 20)
      sketch.rect(-15, -10, 10, 20)
      sketch.rect(-5, -5, 10, 10)
    } else {
      sketch.ellipse(0, 0, 20, 20)
    }
    ts.forEach((v, i) => {
      let mod = v.mod / scale
      sketch.push()
      sketch.rotate(-v.angulo * Math.PI / 180.0)
      sketch.stroke(0, 255, 0);
      sketch.fill(0, 255, 0)
      sketch.line(0, 0, mod, 0)
      sketch.triangle(mod, 0, -5 + mod, -5, -5 + mod, +5)
      sketch.push()
      sketch.translate(+mod + 10, -5)
      sketch.stroke(0);
      sketch.fill(0);
      sketch.rotate(v.angulo * Math.PI / 180.0)
      sketch.text(i + 1, 0, 0);
      sketch.pop()
      sketch.pop()

    })

    let mod = vr.mod / scale
    sketch.push()
    sketch.rotate(-vr.angulo * Math.PI / 180.0)
    sketch.stroke(255, 0, 0);
    sketch.fill(255, 0, 0)
    sketch.line(0, 0, mod, 0)
    sketch.triangle(mod, 0, -5 + mod, -5, -5 + mod, +5)
    sketch.pop()


    sketch.stroke(0, 0, 255);
    sketch.noFill();
    sketch.beginShape();
    vv.ventos.forEach((v, i) => {
      mod = (v.momento + vp.mod + vt.mod) / scale
      sketch.vertex(mod * Math.cos(-v.angulo * Math.PI / 180), mod * Math.sin(-v.angulo * Math.PI / 180))
    })
    vv.ventos.forEach((v, i) => {
      mod = (v.momento + vp.mod + vt.mod) / scale
      sketch.vertex(mod * Math.cos((-v.angulo + 180) * Math.PI / 180), mod * Math.sin((-v.angulo + 180) * Math
        .PI / 180))
    })
    sketch.endShape();
  }
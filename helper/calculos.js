import tiposLib from '../libs/tipos'

export const fnMemoriaDeCalculo = (poste, separator, vento) => {
    let texto = [];


    let resultanteVentoNosCabos = fnCalculaVento(poste, vento)
    let resultanteVentoNoPoste = fnCalculaVentoPoste(poste, vento)
    let resultanteVentoNoTrafo = fnCalculaVentoTrafo(poste, vento)
    
    texto.push(`<strong>Poste ${poste.numero}</strong>`)
    texto.push(separator)

    poste.forcas.forEach((p, i) => {
      p.angulo = parseFloat(p.angulo)
      p.altura = parseFloat(p.altura)
      p.vaoRegulador = parseFloat(p.vaoRegulador)
      p.equip.peso = parseFloat(p.equip.peso)
      p.equip.d = parseFloat(p.equip.d)
      p.deriv.tracao = parseFloat(p.deriv.tracao)
      p.deriv.h = parseFloat(p.deriv.h)

      texto.push(`<strong>Componente ${i+1} - ${tiposLib[p.tipo]}</strong>`)
      if ((p.tipo == 'AT' || p.tipo == 'BT') && p.cabo && p.cabo.tracao) {
        if (p.cabo.multiplos) {
          texto.push(`Cabo: ${p.qtCabos} x ${p.cabo.nome} - Norma ${p.cabo.norma}`)
          texto.push(
            `Tração de acordo com norma: ${p.cabo.tracao.toFixed(2)} x ${p.qtCabos} = ${(p.cabo.tracao * p.qtCabos).toFixed(2)} daN`
          )
          texto.push(
            `Momento: ${(p.cabo.tracao * p.qtCabos).toFixed(2)} x ${p.altura.toFixed(2)} = ${(p.cabo.tracao * p.qtCabos * p.altura).toFixed(2)} daN.m - Ângulo: ${p.angulo.toFixed(2)}°`
          )
        } else {
          texto.push(`Cabo: ${p.cabo.nome} - Norma ${p.cabo.norma}`)
          texto.push(`Tração de acordo com norma: ${p.cabo.tracao.toFixed(2)} daN`)
          texto.push(
            `Momento: Tração x Altura ${p.cabo.tracao.toFixed(2)} x ${p.altura.toFixed(2)} = ${(p.cabo.tracao * p.altura).toFixed(2)} daN.m - Ângulo: ${p.angulo.toFixed(2)}°`
          )
        }
        texto.push(`Cálculo já considera o esforço do vento`)
      }      
      if ((p.tipo == 'FCTE' || p.tipo == 'FOP') && p.cabo) {
        if (!p.cabo.multiplos) {
          p.qtCabos = 1
        }
        if (p.cabo && p.cabo.densidadeLinear) {
          texto.push(
            `Cabo: ${p.qtCabos} x ${p.cabo.nome} - Densidade Linear ${p.cabo.densidadeLinear.toFixed(3)} kg/m - Diâmetro: ${p.cabo.diametro.toFixed(3)} m`
          )
          let tracao = (p.qtCabos * p.cabo.densidadeLinear * p.vaoRegulador ** 2) / (8* 0.01 * p.vaoRegulador)

          texto.push(
            `Tração: ${p.qtCabos} x Densidade x Vão² / 8 x flecha(1%) = ${p.qtCabos} x ${p.cabo.densidadeLinear.toFixed(3)} x ${p.vaoRegulador.toFixed(2)}² / ( 8 x 0,01 x ${p.vaoRegulador.toFixed(2)}) = ${tracao.toFixed(2)} kgf = ${(tracao * 0.980665).toFixed(2)} daN`
          )
          texto.push(
            
            `Momento: Tração x Altura = ${(tracao * 0.980665).toFixed(2)} x ${p.altura.toFixed(2)} = ${(fnCalculaMomento(p)).toFixed(2)} daN.m - Ângulo: ${p.angulo.toFixed(2)}°`
          )
        }
        texto.push(
          `Pressão do Vento (Pv):  k x Vento² = 0.00471 x ${vento}² = ${(0.00471 * (vento ** 2)).toFixed(3)} daN / m²`
        )
        texto.push(
          `Ângulo do Vento (Pior Caso): ${Math.abs(resultanteVentoNosCabos.angulo-p.angulo).toFixed(2)}°`
        )
        texto.push(
          `Força do Vento: Pv x (Vão/2) x Diametro x sen(AnguloAtaque) = ${(0.00471 * (vento ** 2)).toFixed(3)} x (${p.vaoRegulador} / 2) x ${p.cabo.diametro} x sen(${Math.abs(resultanteVentoNosCabos.angulo-p.angulo)}) = ${((0.00471 * (vento ** 2))*(p.vaoRegulador/2)*p.cabo.diametro*Math.sin(Math.abs(resultanteVentoNosCabos.angulo-p.angulo) * Math.PI / 180.0)).toFixed(2)} daN`
        )
        texto.push(
          `Momento devido Vento: ${p.qtCabos} x Força do Vento x Altura = ${p.qtCabos} x ${((0.00471 * (vento ** 2))*(p.vaoRegulador/2)*p.cabo.diametro*Math.sin(Math.abs(resultanteVentoNosCabos.angulo-p.angulo) * Math.PI / 180.0)).toFixed(2)} x ${p.altura} = ${(p.qtCabos*(0.00471 * (vento ** 2))*(p.vaoRegulador/2)*p.cabo.diametro*Math.sin(Math.abs(resultanteVentoNosCabos.angulo-p.angulo) * Math.PI / 180.0)*p.altura).toFixed(2)} daN.m`
        )
      }
      if (p.tipo == 'TRAFO' || p.tipo == 'LUMINARIA' || p.tipo == 'CHAVE') {
        texto.push(
          `Momento: Peso x Distância = ${p.equip.peso.toFixed(2)} x ${p.equip.d.toFixed(2)} = ${(p.equip.peso * p.equip.d).toFixed(2)} daN.m  - Ângulo: ${p.angulo.toFixed(2)}°`
        )
      }
      let resultanteVentoNoTrafo = 0
      if (p.tipo == 'TRAFO') {

        texto.push(
          `Momento devido ao Vento:  k x Vento² x AlturaFixação x ÁreaDoTrafo(XY)`
        )
        resultanteVentoNoTrafo = 0.00754 * (60 **2) * p.equip.h * p.equip.x * p.equip.y
        texto.push(
          `Momento devido ao Vento: 0.00754 x 60² x ${p.equip.h} x ${p.equip.x} x ${p.equip.y} = ${resultanteVentoNoTrafo.toFixed(2)} daN.m`
        )
      }
      if (p.tipo == 'DERIVACAO') {
        texto.push(
          `Momento: Tração x Altura = ${p.deriv.tracao.toFixed(2)} x ${p.deriv.h.toFixed(2)} = ${(p.deriv.tracao * p.deriv.h).toFixed(2)} daN.m  - Ângulo: ${p.angulo.toFixed(2)}°`
        )
      }

      texto.push(
        separator
      )

    })

    let alturaUtil = poste.modelo.altura * 0.9 - 0.6

    texto.push("<strong>Vento no Poste</strong>")
    texto.push(
      `Momento do Vento: ( k / 6 ) x Vento² x AlturaPoste² x ( 2 x LarguraTopo + LarguraBase)`
    )
    texto.push(      
      `Momento do Vento: ( ${poste.modelo.k} / 6 ) x 60² x ${(alturaUtil).toFixed(2)}² x ( 2 x ${poste.modelo.topo} + ${poste.modelo.base} ) = ${resultanteVentoNoPoste.mod.toFixed(2)} daN.m`
    )
    texto.push(
      separator
    )

    texto.push("<strong>Resultante dos Cabos e Equipamentos</strong>")

    poste.forcas.forEach((p, i) => {
      let t = fnVetorMomento(p)
      texto.push(
        `Componente ${i+1}: ${t.mod.toFixed(2)} daN.m - Ângulo ${t.angulo.toFixed(2)}° - X: ${t.x.toFixed(2)} - Y: ${t.y.toFixed(2)}`
      )
    })
    let res = fnResultante(poste);
    texto.push(
      `Resultante: ${res.mod.toFixed(2)} daN.m - Ângulo ${res.angulo.toFixed(2)}° - X: ${res.x.toFixed(2)} - Y: ${res.y.toFixed(2)}`
    )
    texto.push(
      separator
    )

    texto.push("<strong>Momento Aplicado - MAS</strong>")
    texto.push(
      `Resultante dos Cabos e Equipamentos: ${res.mod.toFixed(2)} daN.m`
    )
    texto.push(
      `Vento no Poste: ${resultanteVentoNoPoste.mod.toFixed(2)} daN.m`
    )
    texto.push(
      `Vento nos Cabos: ${resultanteVentoNosCabos.mod.toFixed(2)} daN.m`
    )
    texto.push(
      `Vento no Transformador: ${resultanteVentoNoTrafo.mod.toFixed(2)} daN.m`
    )

    let momentoTotal = res.mod + resultanteVentoNosCabos.mod + resultanteVentoNoPoste.mod + resultanteVentoNoTrafo.mod
  
    texto.push(
      `Momento Aplicado: ${momentoTotal.toFixed(2)} daN.m`
    )
    texto.push(
      separator
    )

    texto.push("<strong>Momento Resistente - MRSA</strong>")
    texto.push(
      `Momento Resistente: 1.40 x Resistência Nominal x (Altura Util - 0.2)`
    )
    let fr = 1
    let mrsa = (1.4 * poste.modelo.carga * (alturaUtil - 0.2))
    texto.push(
      `Momento Resistente: 1.40 x ${poste.modelo.carga.toFixed(2)} x ${(alturaUtil - 0.2).toFixed(2)} = ${mrsa.toFixed(2)} daN.m`
    )
    if ((Math.abs(res.x) < 0.001 && Math.abs(res.y) < 0.001) || poste.modelo.classe == 'Circular') {

    } else {
      let angReducao = fnRebaterAo1Q(res.angulo - poste.rotacao)
      fr = 1.0329 * Math.exp(-0.00722 * angReducao);
      texto.push(
        `Fator de Redução: 1.0329 * EXP(-0.00722 * Angulo) = ${fr.toFixed(2)}`
      )
      texto.push(
        `Ângulo: ${angReducao.toFixed(2)}° (Rotação do poste: ${poste.rotacao}°)`
      )
      texto.push(
        `Momento Resistente Final: ${(mrsa*fr).toFixed(2)} daN.m`
      )
    }
    texto.push(
      separator
    )

    if (mrsa * fr >= momentoTotal) {
      texto.push(
        `<strong>Conclusão: Poste ${poste.modelo.nome} estável (MRSA maior ou igual a MAS)</strong>`
      )
    } else {
      texto.push(
        `<strong>Conclusão: Poste ${poste.modelo.nome} instável (MRSA menor que MAS)</strong>`
      )
    }

    return "<table><tr><td>" + texto.join("<br>").replaceAll(separator + '<br>', separator) +
      "</td></tr></table>"
  }


  export const fnAlturaPadrao = (tipo, alturaUtil) => {
    if (tipo == "AT") {
      if (alturaUtil) {
        return +(alturaUtil * 0.9 - 0.6 - 0.15).toFixed(2)
      } else {
        return 8.70
      }
    }
    if (tipo == "BT") return 7.30
    if (tipo == "FCTE") return 6.50
    if (tipo == "FOP") return 5.70
    if (tipo == "TRAFO") return 6.80
    if (tipo == "DERIVACAO") return 6.50
  }


  export const fnRebaterAo1Q = (angulo) => {
    let a = Math.abs(angulo)
    if (a <= 90) return a
    if (a <= 180) return 180 - a
    if (a <= 270) return a - 180
    return 360 - a
  }


  export const fnResultante = (poste) => {
    let x = 0;
    let y = 0;
    poste.forcas.forEach((ponto, i) => {
      let t = fnVetorMomento(ponto)
      x += t.x
      y += t.y
    })
    return {
      x,
      y,
      angulo: Math.atan2(y, x) * 180 / Math.PI,
      mod: Math.sqrt(x * x + y * y)
    }
  }

  export const fnVetorMomento = (ponto) => {
    let t = fnCalculaMomento(ponto)
    return {
      x: (t * Math.cos(ponto.angulo * Math.PI / 180)),
      y: (t * Math.sin(ponto.angulo * Math.PI / 180)),
      angulo: ponto.angulo,
      mod: t
    }
  }

  let fnCalculaMomento = (ponto) => {

    if (ponto.tipo == 'TRAFO' || ponto.tipo == 'LUMINARIA' || ponto.tipo == 'CHAVE') {
      return ponto.equip.peso * ponto.equip.d
    }

    if (ponto.tipo == 'DERIVACAO') {
      return ponto.deriv.h * ponto.deriv.tracao
    }

    if (!ponto.cabo) return 0;

    if (ponto.tipo == "FCTE" || ponto.tipo == "FOP") {
      ponto.tracaoCabo = 0.980665 * ponto.cabo.densidadeLinear * ponto.vaoRegulador * ponto.vaoRegulador / (8 *
        0.01 * ponto.vaoRegulador)
    }

    if (ponto.tipo == "AT" || ponto.tipo == "BT") {
      ponto.tracaoCabo = ponto.cabo.tracao
    }

    if (!ponto.cabo.multiplos) {

      return ponto.tracaoCabo * ponto.altura;

    } else {

      let redList = [
        0, 0, 1, 3, 6, 10, 15, 21, 28
      ];

      if (ponto.tipo == "AT") {
        return ponto.tracaoCabo * (ponto.altura * ponto.qtCabos)
      } else {
        return ponto.tracaoCabo * (ponto.altura * ponto.qtCabos - 0.2 * redList[ponto.qtCabos])
      }
    }
  }


  export const fnCalculaVentoPoste = (poste, vento) => {
    if (!poste.modelo) return {
      mod: 0
    }
    return {
      mod: (poste.modelo.k / 6) * (vento ** 2) * ((poste.modelo.alturaUtil * 0.9 - 0, 6) ** 2) * (2 *
        poste.modelo.topo + poste.modelo.base)
    }
  }

  export const fnCalculaVentoTrafo = (poste, vento) => {
    let ventoTrafo = 0
    poste.forcas.forEach((ponto, i) => {
      if (ponto.tipo == "TRAFO") {
        ventoTrafo += 0.00754 * ponto.equip.x * ponto.equip.y * ponto.equip.h * (vento ** 2)
      }
    })
    return {
      mod: ventoTrafo
    }
  }


  let fnMomentoResistentePadrao = (poste) => {
    if (!poste.modelo) return {
      mod: 0
    }
    return {
      mod: (poste.modelo.alturaUtil * 0.9 - 0.6 - 0.2) * poste.modelo.carga * 1.4
    }
  }

  export const fnMomentoResistente = (poste) => {
    let fr = 1
    let res = fnResultante(poste)
    if (poste.modelo.classe == 'Duplo-T') {
      if (res.x < 0.001 && res.y < 0.001) {

      } else {
        let angReducao = fnRebaterAo1Q(res.angulo - poste.rotacao)
        fr = 1.0329 * Math.exp(-0.00722 * angReducao);
      }
    }
    return fnMomentoResistentePadrao(poste).mod * fr
  }


  export const fnCalculaVento = (poste, vento) => {

    poste.forcas.forEach((ponto, i) => {
      if (ponto.cabo && (ponto.tipo == "FCTE" || ponto.tipo == "FOP")) {
        /*
        if (ponto.qtCabos > 2 && ponto.tipo == "FCTE") diametro = (1.25 * Math.sqrt(ponto.cabo.diametro * ponto
          .cabo.diametro * ponto.qtCabos))
          */
        ponto.caboVento = 0.00471 * (vento ** 2) * ponto.cabo.diametro * (ponto.vaoRegulador / 2)
      }
    })

    let maxVento = 0
    let maxVentoAng = 0

    let ventos = []
    for (let angVento = 0; angVento <= 180; angVento += 1) {

      let mVento = -1
      poste.forcas.forEach((ponto, i) => {
        if (ponto.cabo && (ponto.tipo == "FCTE" || ponto.tipo == "FOP")) {
          mVento += Math.abs(ponto.qtCabos * ponto.caboVento * Math.sin((angVento - ponto.angulo) * Math.PI /
              180.0) * ponto
            .altura)
        }
      })
      ventos.push({
        angulo: angVento,
        momento: mVento
      })


      if (mVento > maxVento) {
        maxVento = mVento
        maxVentoAng = angVento
      }
    }

    return {
      x: (maxVento * Math.cos(maxVentoAng * Math.PI / 180)),
      y: (maxVento * Math.sin(maxVentoAng * Math.PI / 180)),
      mod: maxVento,
      angulo: maxVentoAng,
      ventos: ventos
    }

  }

  

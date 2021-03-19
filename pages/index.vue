<template>
  <div class="container">

    <b-form-group id="input-group-alturaDoPoste" label="Tipo de Poste:" label-for="input-alturaDoPoste">
      <b-form-select v-model="poste.modelo" class="mb-3" id="input-alturaDoPoste" @change="atualizarAlturas"
        :options="postes.map(x=>{ return {value:x, text:x.nome} })">
      </b-form-select>
    </b-form-group>

    <div>
      <label>Componentes</label><br>

      <div class="row">
        <div class="col-12 col-md-4 col-lg-3" v-for="(ponto, index) in poste.forcas" v-bind:key="index">
          <b-card border-variant="primary" header-bg-variant="primary" header-text-variant="white" align="center">

            <template #header>
              <div class="row">
                <div class="col-10">
                  <h4 class="mb-0">Componente {{index +1  }}</h4>
                </div>
                <div class="col-2">
                  <b-icon class="mt-2" icon="trash" aria-hidden="true" @click="deletar(index)"></b-icon>
                </div>
              </div>
            </template>
            <b-card-text>

              <b-form-group id="input-group-tipo" label="Tipo:" label-for="input-tipo" label-size="sm"
                label-align="left" label-class="mb-0" class="mb-1">
                <b-form-select v-model="ponto.tipo" class="mb-0" id="input-tipo" @change="atualizarAlturas">
                  <b-form-select-option value="AT">Alta Tensão</b-form-select-option>
                  <b-form-select-option value="BT">Baixa Tensão</b-form-select-option>
                  <b-form-select-option value="FCTE">Fibra Optica Copel</b-form-select-option>
                  <b-form-select-option value="FOP">Fibra Optica Operadoras</b-form-select-option>
                  <b-form-select-option value="TRAFO">Transformador</b-form-select-option>
                  <b-form-select-option value="LUMINARIA">Luminária</b-form-select-option>
                  <b-form-select-option value="CHAVE">Chave</b-form-select-option>
                  <b-form-select-option value="DERIVACAO">Derivação</b-form-select-option>
                </b-form-select>
              </b-form-group>

              <b-form-group id="input-group-cabo" label="Cabo:" label-for="input-cabo"
                v-if="ponto.tipo=='AT' || ponto.tipo == 'BT'" label-size="sm" label-align="left" label-class="mb-0"
                class="mb-1">
                <b-form-select v-model="ponto.cabo" class="mb-0"
                  :options="cabos.map(x=>{ return {value:x, text:x.nome} })">
                </b-form-select>
              </b-form-group>

              <b-form-group id="input-group-derivH" label="Altura de Ancoragem (m):" label-for="input-derivH"
                v-if="ponto.tipo=='DERIVACAO'" label-size="sm" label-align="left" label-class="mb-0" class="mb-1">
                <b-form-input type="number" step="0.01" v-model="ponto.deriv.h" class="mb-0" />
              </b-form-group>

              <b-form-group id="input-group-derivT" label="Tração (daN):" label-for="input-derivT"
                v-if="ponto.tipo=='DERIVACAO'" label-size="sm" label-align="left" label-class="mb-0" class="mb-1">
                <b-form-input type="number" step="0.01" v-model="ponto.deriv.tracao" class="mb-0" />
              </b-form-group>


              <b-form-group id="input-group-cabo" label="Cabo:" label-for="input-cabo"
                v-if="ponto.tipo=='FCTE' || ponto.tipo=='FOP'" label-size="sm" label-align="left" label-class="mb-0"
                class="mb-1">
                <b-form-select v-model="ponto.cabo" class="mb-0"
                  :options="fibras.map(x=>{ return {value:x, text:x.nome} })">
                </b-form-select>
              </b-form-group>

              <b-form-group id="input-group-trafox" label="Dimensão X (m):" label-for="input-trafox"
                v-if="ponto.tipo=='TRAFO'" label-size="sm" label-align="left" label-class="mb-0" class="mb-1">
                <b-form-input type="number" step="0.01" v-model="ponto.equip.x" class="mb-0" />
              </b-form-group>

              <b-form-group id="input-group-trafoy" label="Dimensão Y (m):" label-for="input-trafoy"
                v-if="ponto.tipo=='TRAFO'" label-size="sm" label-align="left" label-class="mb-0" class="mb-1">
                <b-form-input type="number" step="0.01" v-model="ponto.equip.y" class="mb-0" />
              </b-form-group>

              <b-form-group id="input-group-trafoh" label="Altura (m):" label-for="input-trafoh"
                v-if="ponto.tipo=='TRAFO'" label-size="sm" label-align="left" label-class="mb-0" class="mb-1">
                <b-form-input type="number" step="0.01" v-model="ponto.equip.h" class="mb-0" />
              </b-form-group>

              <b-form-group id="input-group-trafod" label="Distância do Centro ao Poste (m):" label-for="input-trafod"
                v-if="ponto.tipo=='TRAFO' || ponto.tipo=='LUMINARIA' || ponto.tipo=='CHAVE'" label-size="sm"
                label-align="left" label-class="mb-0" class="mb-1">
                <b-form-input type="number" step="0.01" v-model="ponto.equip.d" class="mb-0" />
              </b-form-group>

              <b-form-group id="input-group-trafop" label="Peso (daN):" label-for="input-trafop"
                v-if="ponto.tipo=='TRAFO' || ponto.tipo=='LUMINARIA' || ponto.tipo=='CHAVE'" label-size="sm"
                label-align="left" label-class="mb-0" class="mb-1">
                <b-form-input type="number" step="1" v-model="ponto.equip.peso" class="mb-0" />
              </b-form-group>

              <b-form-group id="input-group-vaoRegulador" label="Vão Regulador (m):" label-for="input-vaoRegulador"
                v-if="ponto.tipo=='FCTE' || ponto.tipo=='FOP'" label-size="sm" label-align="left" label-class="mb-0"
                class="mb-1">
                <b-form-input type="number" step="0.01" v-model="ponto.vaoRegulador" class="mb-0" />
              </b-form-group>

              <b-form-group id="input-group-qtCabos" label="Quantidade de Cabos:" label-for="input-qtCabos"
                v-if="ponto.cabo && ponto.cabo.multiplos && (ponto.tipo=='FCTE' || ponto.tipo=='FOP' || ponto.tipo=='AT' || ponto.tipo == 'BT')"
                label-size="sm" label-align="left" label-class="mb-0" class="mb-1">
                <b-form-input type="number" step="1" v-model="ponto.qtCabos" class="mb-0" />
              </b-form-group>

              <b-form-group id="input-group-angulo" label="Ângulo (graus):" label-for="input-angulo" label-size="sm"
                label-align="left" label-class="mb-0" class="mb-1">
                <b-form-input type="number" step="0.1" v-model="ponto.angulo" class="mb-0" />
              </b-form-group>

            </b-card-text>

            <template #footer>
              <label>Momento X: {{ fnVetorTracao(ponto).x.toFixed(2) }}
                daN.m</label>
              <label>Momento Y: {{ fnVetorTracao(ponto).y.toFixed(2) }}
                daN.m</label>
              <label>Resultante: {{ fnVetorTracao(ponto).mod.toFixed(2) }}
                daN.m</label>
            </template>
          </b-card>
        </div>

      </div>

      <b-button variant="outline-primary" @click="adicionarComponente">Adicionar Componente</b-button>

      <b-card border-variant="primary" header-bg-variant="primary" header-text-variant="white" align="center">

        <template #header>
          <h4 class="mb-0">Resultante</h4>
        </template>
        <b-card-text>
          <div class="row">


            <div class="col-12 col-md-6 col-lg-6">
              <vue-p5 @setup="setup" @draw="draw">
              </vue-p5>

            </div>

            <div class="col-12 col-md-6 col-lg-6">
              <label>Tração dos Cabos e Equipamentos: {{ resultanteTracao.toFixed(2) }}
                daN.m</label>
              <br>
              <label>Vento Nos Cabos de Telecom: {{ resultanteVentoNosCabos.toFixed(2) }} daN.m</label>
              <br>
              <label>Vento No Poste: {{ resultanteVentoNoPoste.toFixed(2) }} daN.m</label>
              <br>
              <label>Vento No Transformador: {{ resultanteVentoNoTrafo.toFixed(2) }} daN.m</label>
              <br>
              <label>Momento Total: {{ momentoTotal.toFixed(2) }} daN.m</label>
              <br>
              <label>Momento Resistente: {{ momentoResistente.toFixed(2) }} daN.m</label>
              <br><br>
              <b-button :variant="momentoTotal>momentoResistente ? 'danger' : 'success'">
                {{ momentoTotal>momentoResistente ? 'Poste Instável' : 'Poste Estável' }}</b-button>

            </div>
          </div>
        </b-card-text>
      </b-card>

    </div>


  </div>
</template>

<script>
  import VueP5 from 'vue-p5';
  import cabosLib from './cabos.js';
  import postesLib from './postes.js';
  import fibrasLib from './fibras.js';
  export default {
    components: {
      'vue-p5': VueP5
    },
    data() {
      return {
        h: 360,
        w: 360,
        vento: 60,
        cabos: cabosLib,
        postes: postesLib,
        fibras: fibrasLib,
        poste: {
          modelo: postesLib[0],
          forcas: [
            this.p0()
          ]
        }
      }
    },
    mounted() {
      this.atualizarAlturas()
    },
    computed: {
      resultanteTracao() {
        return this.fnResultante().mod
      },
      resultanteVentoNosCabos() {
        return this.fnCalculaVento().mod
      },
      resultanteVentoNoPoste() {
        return this.fnCalculaVentoPoste().mod
      },
      resultanteVentoNoTrafo() {
        return this.fnCalculaVentoTrafo().mod
      },
      momentoResistente() {
        return this.fnMomentoResistente().mod
      },
      momentoTotal() {
        return this.resultanteTracao + this.resultanteVentoNosCabos + this.resultanteVentoNoTrafo + this
          .resultanteVentoNoTrafo
      }
    },
    methods: {
      p0() {
        return {
          tipo: "AT",
          cabo: null,
          qtCabos: 3,
          angulo: 0,
          altura: 7.30,
          equip: {
            x: 1.3,
            y: 1.3,
            h: 6.8,
            d: 0.6,
            peso: 550
          },
          deriv: {
            h: 7.3,
            tracao: 20
          }
        }
      },
      deletar(index) {
        this.poste.forcas.splice(index, 1)
      },
      setup(sketch) {
        sketch.createCanvas(this.w, this.h);
        sketch.background('white');
        sketch.text('Hello p5!', 20, 20);
        sketch.frameRate(1);
      },
      draw(sketch) {
        let maxMod = 0
        let ts = []
        this.poste.forcas.forEach((p, i) => {
          let t = this.fnVetorTracao(p)
          ts.push(t)
          if (maxMod < t.mod) maxMod = t.mod
        })
        let vr = this.fnResultante()
        if (maxMod < vr.mod) maxMod = vr.mod
        let scale = maxMod / (this.w / 2 - 30)
        sketch.background('white');
        sketch.translate(this.h / 2, this.w / 2)
        sketch.fill(200)
        sketch.stroke(200)
        sketch.ellipse(0, 0, 20, 20)
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

      },
      adicionarComponente() {
        this.poste.forcas.push(this.p0())
        this.atualizarAlturas()
      },
      atualizarAlturas() {
        this.poste.forcas.forEach((x, i) => {
          if (this.poste.modelo) {
            if (x.tipo == "AT")
              this.poste.forcas[i].altura = this.poste.modelo.alturaUtil * 0.9 - 0.6 - 0.15
            if (x.tipo == "BT") this.poste.forcas[i].altura = 7.3
            if (x.tipo == "FCTE") this.poste.forcas[i].altura = 6.5
            if (x.tipo == "FOP") this.poste.forcas[i].altura = 5.7
          }
        })
      },
      fnResultante() {
        let x = 0;
        let y = 0;
        this.poste.forcas.forEach((ponto, i) => {
          let t = this.fnVetorTracao(ponto)
          x += t.x
          y += t.y
        })
        return {
          x,
          y,
          angulo: Math.atan2(y, x) * 180 / Math.PI,
          mod: Math.sqrt(x * x + y * y)
        }
      },
      fnVetorTracao(ponto) {
        let t = this.fnCalculaTracao(ponto)
        return {
          x: (t * Math.cos(ponto.angulo * Math.PI / 180)),
          y: (t * Math.sin(ponto.angulo * Math.PI / 180)),
          angulo: ponto.angulo,
          mod: t
        }
      },
      fnCalculaTracao(ponto) {

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
      },
      fnCalculaVentoPoste() {
        if (!this.poste.modelo) return {
          mod: 0
        }
        return {
          mod: (this.poste.modelo.k / 6) * (this.vento ** 2) * ((this.poste.modelo.alturaUtil * 0.9 - 0, 6) ** 2) * (2 *
            this
            .poste.modelo.topo + this.poste.modelo.base)
        }
      },
      fnCalculaVentoTrafo() {
        let ventoTrafo = 0
        this.poste.forcas.forEach((ponto, i) => {
          if (ponto.tipo == "TRAFO") {
            ventoTrafo += 0.00754 * ponto.equip.x * ponto.equip.y * ponto.equip.h * (this.vento ** 2)
          }
        })
        return {
          mod: ventoTrafo
        }
      },
      fnMomentoResistente() {
        if (!this.poste.modelo) return {
          mod: 0
        }
        return {
          mod: (this.poste.modelo.alturaUtil * 0.9 - 0.6 - 0.2) * this.poste.modelo.carga * 1.4
        }
      },
      fnCalculaVento() {

        this.poste.forcas.forEach((ponto, i) => {
          if (ponto.cabo && (ponto.tipo == "FCTE" || ponto.tipo == "FOP")) {
            let diametro = ponto.cabo.diametro * ponto.qtCabos
            /*
            if (ponto.qtCabos > 2 && ponto.tipo == "FCTE") diametro = (1.25 * Math.sqrt(ponto.cabo.diametro * ponto
              .cabo.diametro * ponto.qtCabos))
              */
            ponto.caboVento = 0.00471 * (this.vento ** 2) * diametro * (ponto.vaoRegulador / 2)
          }
        })

        let maxVento = 0
        let maxVentoAng = 0
        for (let angVento = 0; angVento <= 90; angVento += 1) {

          let mVento = 0
          this.poste.forcas.forEach((ponto, i) => {
            if (ponto.cabo && (ponto.tipo == "FCTE" || ponto.tipo == "FOP")) {
              mVento += Math.abs(ponto.caboVento * Math.sin((angVento - ponto.angulo) * Math.PI / 180.0) * ponto
                .altura)
            }
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
          ang: maxVentoAng
        }

      }
    }
  }

</script>

<style>
  .container {
    margin: 0 auto;
    min-height: 100vh;
  }

</style>

<template>
  <div class="container">

    <b-card border-variant="primary" header-bg-variant="primary" header-text-variant="white" align="center">

      <template #header>

        <b-form-group id="input-group-numposte" label="Número do Poste:" label-for="input-numposte" label-size="sm"
          label-align="left" label-class="mb-0" class="mb-1">
          <b-form-input type="number" step="1" v-model="poste.numero" class="mb-0" />
        </b-form-group>

      </template>
      <b-card-text>


        <b-form-group id="input-group-alturaDoPoste" label="Tipo de Poste:" label-for="input-alturaDoPoste">
          <b-form-select v-model="poste.modelo" class="mb-3" id="input-alturaDoPoste" @change="atualizarAlturas"
            :options="postes.map(x=>{ return {value:x, text:x.nome} })">
          </b-form-select>
        </b-form-group>

        <div>
          <label>Componentes</label><br>

          <div class="row">
            <div class="col-12 col-lg-4 col-xl-3" v-for="(ponto, index) in poste.forcas" v-bind:key="index">
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
                    <b-form-select v-model="ponto.tipo" class="mb-0" id="input-tipo" @change="atualizarAltura(ponto)">
                      <b-form-select-option value="AT">Alta Tensão</b-form-select-option>
                      <b-form-select-option value="BT">Baixa Tensão</b-form-select-option>
                      <b-form-select-option value="FCTE">Fibra Optica Copel</b-form-select-option>
                      <b-form-select-option value="FOP">Cabo de Outras Operadoras</b-form-select-option>
                      <b-form-select-option value="TRAFO">Transformador</b-form-select-option>
                      <b-form-select-option value="LUMINARIA">Luminária</b-form-select-option>
                      <b-form-select-option value="CHAVE">Chave</b-form-select-option>
                      <b-form-select-option value="DERIVACAO">Derivação</b-form-select-option>
                    </b-form-select>
                  </b-form-group>

                  <b-form-group id="input-group-cabo" label="Cabo:" label-for="input-cabo" v-if="ponto.tipo=='AT'"
                    label-size="sm" label-align="left" label-class="mb-0" class="mb-1">
                    <b-form-select v-model="ponto.cabo" class="mb-0"
                      :options="cabos.filter(x=>x.altaTensao).map(x=>{ return {value:x, text:x.nome} })">
                    </b-form-select>
                  </b-form-group>

                  <b-form-group id="input-group-cabo" label="Cabo:" label-for="input-cabo" v-if="ponto.tipo == 'BT'"
                    label-size="sm" label-align="left" label-class="mb-0" class="mb-1">
                    <b-form-select v-model="ponto.cabo" class="mb-0"
                      :options="cabos.filter(x=>x.baixaTensao).map(x=>{ return {value:x, text:x.nome} })">
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


                  <b-form-group id="input-group-cabo" label="Cabo:" label-for="input-cabo" v-if="ponto.tipo=='FCTE'"
                    label-size="sm" label-align="left" label-class="mb-0" class="mb-1">
                    <b-form-select v-model="ponto.cabo" class="mb-0"
                      :options="fibras.filter(x=>x.copel == true).map(x=>{ return {value:x, text:x.nome} })">
                    </b-form-select>
                  </b-form-group>


                  <b-form-group id="input-group-cabo" label="Cabo:" label-for="input-cabo" v-if="ponto.tipo=='FOP'"
                    label-size="sm" label-align="left" label-class="mb-0" class="mb-1">
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

                  <b-form-group id="input-group-trafod" label="Distância do Centro ao Poste (m):"
                    label-for="input-trafod"
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


                  <b-form-group id="input-group-altura" label="Altura (m):" label-for="input-altura" label-size="sm"
                    label-align="left" label-class="mb-0" class="mb-1"
                    v-if="ponto.tipo!='CHAVE' && ponto.tipo!='LUMINARIA' && ponto.tipo!='TRAFO'">
                    <b-form-input type="number" step="0.01" v-model="ponto.altura" class="mb-0" />
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
                    {{ momentoTotal>momentoResistente ? `Poste ${this.poste.modelo.nome} Instável` : `Poste ${this.poste.modelo.nome} Estável` }}
                  </b-button>

                </div>
              </div>
            </b-card-text>
          </b-card>
          <b-card border-variant="primary" header-bg-variant="primary" header-text-variant="white" align="center">

            <template #header>
              <h4 class="mb-0">Memória de Cálculo: <b-button variant="info" @click="copiarMemoria">Copiar</b-button>
              </h4>
            </template>
            <b-card-text>
              <div ref='memoria' v-html="memoriaDeCalculo"></div>
            </b-card-text>
          </b-card>
        </div>
      </b-card-text>

    </b-card>


    <div>
      <input type="file" class="d-none" ref="myFile" @change="carregarArquivo"><br />

      <b-button variant="primary" @click="salvar">Download</b-button>
      <b-button variant="secondary" @click="carregar">Carregar</b-button>
      <b-button variant="danger" @click="limpar">Limpar</b-button>
    </div>


    <p>Projeto de código aberto, contribua em <a
        href="https://github.com/foadmk/calculadora-dis">https://github.com/foadmk/calculadora-dis</a></p>
  </div>
</template>

<script>
  import VueP5 from 'vue-p5';
  import cabosLib from './cabos.js';
  import postesLib from './postes.js';
  import fibrasLib from './fibras.js';
  import { fnMemoriaDeCalculo, fnCalculaVento, fnCalculaVentoPoste, fnCalculaVentoTrafo, fnAlturaPadrao, fnRebaterAo1Q, fnResultante, fnVetorTracao, fnMomentoResistente } from '../helper/calculos'
  import { drawSetup, drawLoop } from '../helper/draw'
  export default {
    components: {
      'vue-p5': VueP5
    },
    data() {
      return {
        sketch: null,
        h: 360,
        w: 360,
        vento: 60,
        text: 'xxx',
        separator: '</td></tr><tr><td>',
        tipos: {
          'AT': 'Alta Tensão',
          'BT': 'Baixa Tensão',
          'FCTE': 'Fibra Óptica Copel',
          'FOP': 'Cabos de Outras Operadoras',
          'TRAFO': 'Transformador',
          'LUMINARIA': 'Luminária',
          'CHAVE': 'Chave',
          'DERIVACAO': 'Derivação'
        },
        cabos: cabosLib,
        postes: postesLib,
        fibras: fibrasLib,
        poste: {
          numero: '',
          modelo: postesLib[0],
          forcas: [
            this.p0()
          ]
        }
      }
    },
    watch: {
      poste: {
        handler(val) {
          if (this.sketch) this.sketch.redraw()
          this.poste.versao = 1
          localStorage.setItem('dados_v1', JSON.stringify(this.poste));
        },
        deep: true
      },
    },
    mounted() {
      //this.atualizarAlturas()
      let json = localStorage.getItem('dados_v1');
      if (json) {
        let j = JSON.parse(json)
        if (j.versao == 1) this.carregarV1(j)
      }
    },
    computed: {
      resultanteTracao() {
        return fnResultante(this.poste).mod
      },
      resultanteVentoNosCabos() {
        return fnCalculaVento(this.poste, 60).mod
      },
      resultanteVentoNoPoste() {
        return fnCalculaVentoPoste(this.poste, 60).mod
      },
      resultanteVentoNoTrafo() {
        return fnCalculaVentoTrafo(this.poste, 60).mod
      },
      momentoResistente() {
        return fnMomentoResistente(this.poste)
      },
      momentoTotal() {
        return this.resultanteTracao + this.resultanteVentoNosCabos + this.resultanteVentoNoPoste + this
          .resultanteVentoNoTrafo
      },
      memoriaDeCalculo() {
        if(this.poste) return fnMemoriaDeCalculo(this.poste, this.separator, this.tipos, this.vento) 
      }
    },
    methods: {
      isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
      },
      fnVetorTracao(p){
        return fnVetorTracao(p)
      },
      p0() {
        return {
          tipo: "AT",
          cabo: null,
          qtCabos: 3,
          angulo: 0,
          altura: fnAlturaPadrao("AT"),
          vaoRegulador: 40,
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
        drawSetup(sketch, this.w, this.h);
        this.sketch = sketch
      },
      draw(sketch) {
        drawLoop(sketch, this.w, this.h, this.poste);
      },
      adicionarComponente() {
        this.poste.forcas.push(this.p0())
        //this.atualizarAlturas()
      },
      atualizarAlturas() {
        this.poste.forcas.forEach((x, i) => {
          if (x.tipo == 'AT') this.poste.forcas[i].altura = fnAlturaPadrao(x.tipo, this.poste.alturaUtil)
        })
      },
      atualizarAltura(ponto) {
        ponto.altura = fnAlturaPadrao(ponto.tipo, this.poste.alturaUtil)
      },
      selectText(element) {
        var range;
        if (document.selection) {
          // IE
          range = document.body.createTextRange();
          range.moveToElementText(element);
          range.select();
        } else if (window.getSelection) {
          range = document.createRange();
          range.selectNode(element);
          window.getSelection().removeAllRanges();
          window.getSelection().addRange(range);
        }
      },
      copiarMemoria() {
        this.selectText(this.$refs.memoria)
        document.execCommand("copy")
      },

     
      carregarV1(res) {
        this.poste = res
      },
      carregar() {
        this.$refs.myFile.click()
      },
      carregarArquivo() {
        let file = this.$refs.myFile.files[0];
        //if(!file || file.type !== 'text/plain') return;

        // Credit: https://stackoverflow.com/a/754398/52160
        let reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = evt => {
          let res = JSON.parse(evt.target.result);
          console.log(res)
          if (res.versao == 1) {
            this.carregarV1(res)
          }
        }
        reader.onerror = evt => {
          console.error(evt);
        }

        this.$refs.myFile.value = ''

      },
      salvar() {
        this.poste.versao = 1
        const data = JSON.stringify(this.poste)
        const blob = new Blob([data], {
          type: 'text/plain'
        })
        const e = document.createEvent('MouseEvents'),
          a = document.createElement('a');
        a.download = `${this.poste.numero}.json`;
        a.href = window.URL.createObjectURL(blob);
        a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
        e.initEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        a.dispatchEvent(e);
      },
      limpar() {
        this.poste = {
          numero: '',
          modelo: postesLib[0],
          forcas: [
            this.p0()
          ]
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

  tr {
    border: 1px solid #000;
  }

</style>

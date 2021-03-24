<template>
  <div class="container">

    <b-form-group id="input-group-numposte" label="Número do Poste:" label-for="input-numposte"
      label-size="sm"
      label-align="left" label-class="mb-0" class="mb-1">
      <b-form-input type="number" step="1" v-model="poste.numero" class="mb-0" />
    </b-form-group>

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
        if(j.versao == 1) this.carregarV1(j)
      }
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
        let fr = 1
        let res = this.fnResultante()
        if (this.poste.modelo.classe == 'Duplo-T') {
          if (res.x < 0.001 && res.y < 0.001) {

          } else {
            let angReducao = this.fnRebaterAo1Q(res.angulo)
            fr = 1.0329 * Math.exp(-0.00722 * angReducao);
          }
        }
        return this.fnMomentoResistente().mod * fr
      },
      momentoTotal() {
        return this.resultanteTracao + this.resultanteVentoNosCabos + this.resultanteVentoNoPoste + this
          .resultanteVentoNoTrafo
      },
      memoriaDeCalculo() {
        let texto = []
        let ventoCabos = this.fnCalculaVento()
        this.poste.forcas.forEach((p, i) => {
          p.angulo = parseFloat(p.angulo)
          p.altura = parseFloat(p.altura)
          p.vaoRegulador = parseFloat(p.vaoRegulador)
          p.equip.peso = parseFloat(p.equip.peso)
          p.equip.d = parseFloat(p.equip.d)
          p.deriv.tracao = parseFloat(p.deriv.tracao)
          p.deriv.h = parseFloat(p.deriv.h)

          texto.push(`<strong>Componente ${i+1} - ${this.tipos[p.tipo]}</strong>`)
          if ((p.tipo == 'AT' || p.tipo == 'BT') && p.cabo && p.cabo.tracao) {
            if (p.cabo.multiplos) {
              texto.push(`Cabo: ${p.qtCabos} x ${p.cabo.nome} - Norma ${p.cabo.norma}`)
              texto.push(
                `Tração de acordo com norma: ${p.cabo.tracao.toFixed(2)} x ${p.qtCabos} = ${(p.cabo.tracao * p.qtCabos).toFixed(2)} daN`
              )
              texto.push(
                `Momento: ${(p.cabo.tracao * p.qtCabos).toFixed(2)} x ${p.altura.toFixed(2)} = ${(p.cabo.tracao * p.qtCabos * p.altura).toFixed(2)} daN.m - Ângulo: ${p.angulo.toFixed(2)}`
              )
            } else {
              texto.push(`Cabo: ${p.cabo.nome} - Norma ${p.cabo.norma}`)
              texto.push(`Tração de acordo com norma: ${p.cabo.tracao.toFixed(2)} daN`)
              texto.push(
                `Momento: Tração x Altura ${p.cabo.tracao.toFixed(2)} x ${p.altura.toFixed(2)} = ${(p.cabo.tracao * p.altura).toFixed(2)} daN.m - Ângulo: ${p.angulo.toFixed(2)}`
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
              texto.push(
                `Tração: ${p.qtCabos} x Densidade x Vão² / 8 x flecha(1%) = ${p.qtCabos} x ${p.cabo.densidadeLinear.toFixed(3)} x ${p.vaoRegulador.toFixed(2)}² / ( 8 x 0,01 x ${p.vaoRegulador.toFixed(2)}) = ${(p.qtCabos * p.cabo.densidadeLinear * p.vaoRegulador ** 2 / (8* 0.01 * p.vaoRegulador)).toFixed(2)} daN`
              )
              texto.push(
                `Momento: Tração x Altura = ${(p.qtCabos * p.cabo.densidadeLinear * p.vaoRegulador ** 2 / (8* 0.01 * p.vaoRegulador)).toFixed(2)} x ${p.altura.toFixed(2)} = ${(this.fnCalculaTracao(p)).toFixed(2)} daN.m - Ângulo: ${p.angulo.toFixed(2)}`
              )
            }
            texto.push(
              `Pressão do Vento (Pv):  k x Vento² = 0.00471 x ${this.vento}² = ${(0.00471 * (this.vento ** 2)).toFixed(3)} daN / m²`
            )
            texto.push(
              `Ângulo do Vento (Pior Caso): ${Math.abs(ventoCabos.angulo-p.angulo).toFixed(2)}`
            )
            texto.push(
              `Força do Vento: Pv x (Vão/2) x Diametro x sen(AnguloAtaque) = ${(0.00471 * (this.vento ** 2)).toFixed(3)} x (${p.vaoRegulador} / 2) x ${p.cabo.diametro} x sen(${Math.abs(ventoCabos.angulo-p.angulo)}) = ${((0.00471 * (this.vento ** 2))*(p.vaoRegulador/2)*p.cabo.diametro*Math.sin(Math.abs(ventoCabos.angulo-p.angulo) * Math.PI / 180.0)).toFixed(2)} daN`
            )
            texto.push(
              `Momento devido Vento: ${p.qtCabos} x Força do Vento x Altura = ${p.qtCabos} x ${((0.00471 * (this.vento ** 2))*(p.vaoRegulador/2)*p.cabo.diametro*Math.sin(Math.abs(ventoCabos.angulo-p.angulo) * Math.PI / 180.0)).toFixed(2)} x ${p.altura} = ${(p.qtCabos*(0.00471 * (this.vento ** 2))*(p.vaoRegulador/2)*p.cabo.diametro*Math.sin(Math.abs(ventoCabos.angulo-p.angulo) * Math.PI / 180.0)*p.altura).toFixed(2)} daN.m`
            )
          }
          if (p.tipo == 'TRAFO' || p.tipo == 'LUMINARIA' || p.tipo == 'CHAVE') {
            texto.push(
              `Momento: Peso x Distância = ${p.equip.peso.toFixed(2)} x ${p.equip.d.toFixed(2)} = ${(p.equip.peso * p.equip.d).toFixed(2)} daN.m  - Ângulo: ${p.angulo.toFixed(2)}`
            )
          }
          if (p.tipo == 'TRAFO') {

            texto.push(
              `Momento devido ao Vento:  k x Vento² x AlturaFixação x ÁreaDoTrafo(XY)`
            )
            texto.push(
              `Momento devido ao Vento: 0.00754 x 60² x ${p.equip.h} x ${p.equip.x} x ${p.equip.y} = ${this.resultanteVentoNoTrafo.toFixed(2)} daN.m`
            )
          }
          if (p.tipo == 'DERIVACAO') {
            texto.push(
              `Momento: Tração x Altura = ${p.deriv.tracao.toFixed(2)} x ${p.deriv.h.toFixed(2)} = ${(p.deriv.tracao * p.deriv.h).toFixed(2)} daN.m  - Ângulo: ${p.angulo.toFixed(2)}`
            )
          }

          texto.push(
            this.separator
          )

        })

        let alturaUtil = this.poste.modelo.altura * 0.9 - 0.6

        texto.push("<strong>Vento no Poste</strong>")
        texto.push(
          `Momento do Vento: ( k / 6 ) x Vento² x AlturaPoste² x ( 2 x LarguraTopo + LarguraBase)`
        )
        texto.push(
          `Momento do Vento: ( ${this.poste.modelo.k} / 6 ) x 60² x ${(alturaUtil).toFixed(2)}² x ( 2 x ${this.poste.modelo.topo} + ${this.poste.modelo.base} ) = ${this.resultanteVentoNoPoste.toFixed(2)} daN.m`
        )
        texto.push(
          this.separator
        )

        texto.push("<strong>Resultante dos Cabos e Equipamentos</strong>")

        this.poste.forcas.forEach((p, i) => {
          let t = this.fnVetorTracao(p)
          texto.push(
            `Componente ${i+1}: ${t.mod.toFixed(2)} daN.m - Ângulo ${t.angulo.toFixed(2)} - X: ${t.x.toFixed(2)} - Y: ${t.y.toFixed(2)}`
          )
        })
        let res = this.fnResultante();
        texto.push(
          `Resultante: ${res.mod.toFixed(2)} daN.m - Ângulo ${res.angulo.toFixed(2)} - X: ${res.x.toFixed(2)} - Y: ${res.y.toFixed(2)}`
        )
        texto.push(
          this.separator
        )

        texto.push("<strong>Momento Aplicado - MAS</strong>")
        texto.push(
          `Resultante dos Cabos e Equipamentos: ${res.mod.toFixed(2)} daN.m`
        )
        texto.push(
          `Vento no Poste: ${this.resultanteVentoNoPoste.toFixed(2)} daN.m`
        )
        texto.push(
          `Vento nos Cabos: ${this.resultanteVentoNosCabos.toFixed(2)} daN.m`
        )
        texto.push(
          `Vento no Transformador: ${this.resultanteVentoNoTrafo.toFixed(2)} daN.m`
        )
        texto.push(
          `Momento Aplicado: ${this.momentoTotal.toFixed(2)} daN.m`
        )
        texto.push(
          this.separator
        )

        texto.push("<strong>Momento Resistente - MRSA</strong>")
        texto.push(
          `Momento Resistente: 1.40 x Resistência Nominal x (Altura Util - 0.2)`
        )
        let fr = 1
        let mrsa = (1.4 * this.poste.modelo.carga * (alturaUtil - 0.2))
        texto.push(
          `Momento Resistente: 1.40 x ${this.poste.modelo.carga.toFixed(2)} x ${(alturaUtil - 0.2).toFixed(2)} = ${mrsa.toFixed(2)} daN.m`
        )
        if ((Math.abs(res.x) < 0.001 && Math.abs(res.y) < 0.001) || this.poste.modelo.classe == 'Circular') {

        } else {
          let angReducao = this.fnRebaterAo1Q(res.angulo)
          fr = 1.0329 * Math.exp(-0.00722 * angReducao);
          texto.push(
            `Fator de Redução: 1.0329 * EXP(-0.00722 * Angulo) = ${fr.toFixed(2)}`
          )
          texto.push(
            `Ângulo: ${angReducao.toFixed(2)}`
          )
          texto.push(
            `Momento Resistente Final: ${(mrsa*fr).toFixed(2)} daN.m`
          )
        }
        texto.push(
          this.separator
        )

        if (mrsa * fr >= this.momentoTotal) {
          texto.push(
            `<strong>Conclusão: Poste ${this.poste.modelo.nome} estável (MRSA maior ou igual a MAS)</strong>`
          )
        } else {
          texto.push(
            `<strong>Conclusão: Poste ${this.poste.modelo.nome} instável (MRSA menor que MAS)</strong>`
          )
        }

        return "<table><tr><td>" + texto.join("<br>").replaceAll(this.separator + '<br>', this.separator) +
          "</td></tr></table>"
      }
    },
    methods: {
      isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
      },
      p0() {
        return {
          tipo: "AT",
          cabo: null,
          qtCabos: 3,
          angulo: 0,
          altura: this.fnAlturaPadrao("AT"),
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
        sketch.createCanvas(this.w, this.h);
        sketch.background('black');
        sketch.noLoop()
        this.sketch = sketch
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
        let vv = this.fnCalculaVento()
        let vp = this.fnCalculaVentoPoste()
        let vt = this.fnCalculaVentoTrafo()
        if (maxMod < (vv.mod + vp.mod + vt.mod)) maxMod = (vv.mod + vp.mod + vt.mod)
        let scale = maxMod / (this.w / 2 - 30)
        sketch.background('white');
        sketch.translate(this.h / 2, this.w / 2)
        sketch.fill(200)
        sketch.stroke(200)
        if (this.poste.modelo.classe == 'Duplo-T') {
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

      },
      adicionarComponente() {
        this.poste.forcas.push(this.p0())
        //this.atualizarAlturas()
      },
      fnAlturaPadrao(tipo) {
        if (tipo == "AT") {
          if (this.poste && this.poste.modelo) {
            return +(this.poste.modelo.alturaUtil * 0.9 - 0.6 - 0.15).toFixed(2)
          } else {
            return 8.70
          }
        }
        if (tipo == "BT") return 7.30
        if (tipo == "FCTE") return 6.50
        if (tipo == "FOP") return 5.70
        if (tipo == "TRAFO") return 6.80
        if (tipo == "DERIVACAO") return 6.50
      },
      atualizarAlturas() {
        this.poste.forcas.forEach((x, i) => {
          if (x.tipo == 'AT') this.poste.forcas[i].altura = this.fnAlturaPadrao(x.tipo)
        })
      },
      atualizarAltura(ponto) {
        ponto.altura = this.fnAlturaPadrao(ponto.tipo)
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
      fnRebaterAo1Q(angulo) {
        let a = Math.abs(angulo)
        if (a <= 90) return a
        if (a <= 180) return 180 - a
        if (a <= 270) return a - 180
        return 360 - a
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
            /*
            if (ponto.qtCabos > 2 && ponto.tipo == "FCTE") diametro = (1.25 * Math.sqrt(ponto.cabo.diametro * ponto
              .cabo.diametro * ponto.qtCabos))
              */
            ponto.caboVento = 0.00471 * (this.vento ** 2) * ponto.cabo.diametro * (ponto.vaoRegulador / 2)
          }
        })

        let maxVento = 0
        let maxVentoAng = 0

        let ventos = []
        for (let angVento = 0; angVento <= 180; angVento += 1) {

          let mVento = -1
          this.poste.forcas.forEach((ponto, i) => {
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
         this.poste ={
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

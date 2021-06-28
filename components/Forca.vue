<template>
  <div class="col-12 col-lg-4 col-xl-3">
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

        <b-form-group id="input-group-tipo" label="Tipo:" label-for="input-tipo" label-size="sm" label-align="left"
          label-class="mb-0" class="mb-1">
          <b-form-select v-model="ponto.tipo" class="mb-0" id="input-tipo" @change="changeTipo(ponto)">
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

        <b-form-group id="input-group-cabo" label="Cabo:" label-for="input-cabo" v-if="ponto.tipo=='AT'" label-size="sm"
          label-align="left" label-class="mb-0" class="mb-1">
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
          <b-form-select v-model="ponto.cabo" class="mb-0" :options="fibras.map(x=>{ return {value:x, text:x.nome} })">
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

        <b-form-group id="input-group-trafoh" label="Altura (m):" label-for="input-trafoh" v-if="ponto.tipo=='TRAFO'"
          label-size="sm" label-align="left" label-class="mb-0" class="mb-1">
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
        <label>Momento X: {{ fnVetorMomento(ponto).x.toFixed(2) }}
          daN.m</label>
        <label>Momento Y: {{ fnVetorMomento(ponto).y.toFixed(2) }}
          daN.m</label>
        <label>Resultante: {{ fnVetorMomento(ponto).mod.toFixed(2) }}
          daN.m</label>
      </template>
    </b-card>
  </div>
</template>

<script>
 import cabosLib from '../libs/cabos.js';
 import tiposLib from '../libs/tipos.js';
  import postesLib from '../libs/postes.js';
  import fibrasLib from '../libs/fibras.js';
  import { fnMemoriaDeCalculo, fnCalculaVento, fnCalculaVentoPoste, fnCalculaVentoTrafo, fnAlturaPadrao, fnRebaterAo1Q, fnResultante, fnVetorMomento, fnMomentoResistente } from '../helper/calculos'

export default {
props: {
      ponto: {
        type: Object,
        required: true
      },
      index: {
        type: Number,
        required: true,
      }
    },
    data() {
      return {
        tipos: tiposLib,
        cabos: cabosLib,
        postes: postesLib,
        fibras: fibrasLib,
      }
    },
    methods: {
            fnVetorMomento(p){
        return fnVetorMomento(p)
      },
      changeTipo(ponto) {
        this.$emit("atualizarAltura", ponto)
      },
      deletar(index) {
        this.$emit("deletar", index)
      }
    }
}
</script>
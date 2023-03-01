<template>
<div></div>
</template>
<style lang="scss" scoped>

</style>

<script>
import md5 from 'js-md5';
import { Base64 } from 'js-base64';
import axios from 'axios';

export default {
  name: 'Enter',
  components: {
  },
  metaInfo: {
    meta: [
      { name: 'description', content: '辩之竹辩论计时器,进入计时器' },
      {
        name: 'keywords',
        content: '辩之竹,Online辩论,辩论,辩论计时器,进入计时器,计时码',
      },
    ],
  },
  async mounted() {
    console.log('Enter-MOUNT!');
    if (this.isElectron) {
      this.userIpInfo.country = '中国';
      console.log('Jump to url!');
      this.computedUrl();
    }
  },
  data() {
    const elecCode = 'USELESS';
    return {
      ringBellTime: 30,
      languageSelection: 'zh',
      crashDialog: true,
      ipDialog: false,
      userIpInfo: {
        ip: '',
        address: '',
        cid: '',
        dialog: false,
      },
      isElectron: process.env.IS_ELECTRON === true,
      electronTimerId: 'USELESS',
      search: '',
      headers: [
        {
          text: this.$t('enter.codes.headers.name'),
          align: 'start',
          value: 'name',
        },
        { text: this.$t('enter.codes.headers.code'), value: 'code' },
        // { text: '使用次数', value: 'useTimes' },
      ],
      customBackground: false,
      customBackgroundPass: '',
      t0: '《《》》辩题1',
      t1: '《《》》辩题2',
      n0: '《《》》组名1',
      n1: '《《》》组名2',
      useUserColor: false,
      useColorCode: false,
      color: {
        code: '',
        title: '#e0ffff',
        team: '#ffffff',
        match: '#28769b',
        round: '#ffffff',
        bigTimer: '#ffffff',
        timerZheng: '#BF2727',
        timerFan: '#007A9C',
      },
      useEnglish: false,
      useTraditional: false,
      useButton: true,
      useB: false,
      rules: {
        required: (value) => !!value || this.$t('enter.timerCodeWarn'),
      },
      useNotifySound: true,
      code: process.env.IS_ELECTRON ? elecCode : '',
      watermarkStr: this.$t('enter.settings.watermarkHint'),
      displayWatermark: false,
    };
  },
  methods: {
    generateCode() {
      const { code, customBackgroundPass } = this;
      return md5(code + customBackgroundPass + code);
    },
    computedUrl() {
      let { code } = this;
      if (this.code === '') code = 1;
      const params = {
        rid: code,
        nub: !this.useButton,
        useb: this.useB,
        off: this.isElectron,
        ringBellTime: this.ringBellTime,
      };
      // const host = process.env.VUE_APP_HOST;
      const str = `./#/show/?rid=${code}&nub=${!this.useButton}&useb=${this.useB}&off=${this.isElectron}`;
      if (this.customBackground) params.custom = true;
      // str += '&custom=true'; // &code=${this.generateCode()}
      if (this.displayWatermark) params.water = true;// str += '&water=true';
      else params.water = false;// str += '&water=false';
      if (!this.useNotifySound) params.notify = false;// str += '&notify=false';
      if (this.useUserColor) params.color = true;// str += '&color=true';
      if (this.useColorCode && this.color.code !== '') {
        // str += `&colorCode=${(
        //   Base64.decode(this.color.code),
        // )}`;
        params.colorCode = Base64.decode(this.color.code);
      } else {
        // str += `&colorCode=${(
        //   Base64.decode(this.colorCode),
        // )}`;
        params.colorCode = Base64.decode(this.colorCode);
      }
      console.log(this.t0, this.n0);
      if (this.t0 !== '') {
        params.n0 = this.t0;
        params.n1 = this.t1;
        // str += `&n0=${(this.t0)}&n1=${(
        //   this.t1,
        // )}`;
      }
      if (this.n0 !== '') {
        params.t0 = this.n0;
        params.t1 = this.n1;
        // str += `&t0=${(this.n0)}&t1=${(
        //   this.n1,
        // )}`;
      }
      console.log('going to show page:');
      console.log(params);
      this.$router.push({ name: 'Show', query: params });
      return str;
    },
  },
  computed: {
    compTimerUrl() {
      return `${process.env.VUE_APP_VUERO_HOST}/#/app/timer-set/list`;
    },
    cantForward() {
      return this.code === 0;
    },
    colorCode() {
      const {
        title,
        team,
        match,
        round,
        bigTimer,
        timerZheng,
        timerFan,
      } = this.color;
      return Base64.encode(
        [title, team, match, round, bigTimer, timerZheng, timerFan].join('|'),
      );
    },
  },
  watch: {
    languageSelection(newV, old) {
      this.$i18n.locale = newV;
      console.log(newV, old);
    },
  },
};
</script>

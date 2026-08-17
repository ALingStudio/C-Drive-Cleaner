export namespace main {
	
	export class Settings {
	    logEnabled: boolean;
	    lang: string;
	
	    static createFrom(source: any = {}) {
	        return new Settings(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.logEnabled = source["logEnabled"];
	        this.lang = source["lang"];
	    }
	}

}


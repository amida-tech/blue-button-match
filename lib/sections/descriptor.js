/*

partial matching result structure

FLAT

[
    { "match" : "duplicate", "src_id" : 0, "dest_id": 2 },
    { "match" : "new", "src_id" :1 },
    { "match" : "partial", "percent" : 50, "src_id" : 2, "dest_id" : 5},
    ...
    }
],

SUBARRAY

[
    { "match" : "new", "src_id" :1 }, //completely new element
    { "match" : "duplicate", "src_id" : 0, "dest_id": 2 }, //completely duplicate element

    { "match" : "duplicate_new_subelements", "src_id" : 0, "dest_id": 2 
    	"subelements": [
		    { "match" : "duplicate", "src_id" : 0, "dest_id": 2 },
		    { "match" : "new", "src_id" :1 },
		    { "match" : "partial", "percent" : 50, "src_id" : 2, "dest_id" : 5},
		    ...
		    }
    	]

    }, //completely duplicate element but difference in subelements exists

    { "match" : "partial", "percent" : 50, "src_id" : 2, "dest_id" : 5
    	"subelements": [
		    { "match" : "duplicate", "src_id" : 0, "dest_id": 2 },
		    { "match" : "new", "src_id" :1 },
		    { "match" : "partial", "percent" : 50, "src_id" : 2, "dest_id" : 5},
		    ...
		    }
    	]
    }, 
    ...
    } //partial match
],


DEMOGRAPHICS

//only one match element present
[
    { "match" : "duplicate"}, //record is complete duplicate
],

[
    { "match" : "diff", 
    	"diff": {
			"element_name_1":"duplicate", //element is the same
			"element_name_2":"new", //element has new value
    	}},
],


--- PARTIAL MATCH RULES

Vital Signs - flat
                
	code+code_system_name
	date (single date)
	status

Medications - flat

	product.code+product.code_system_name
	or
	product.translation.code+code_system_name
	date (range)
	status

	administration.route (code) .form(code)

Problems - flat

	code+
	date(range)

	status
	patient_status

Immunization - flat
	product.code + product.translation.code

	date

	status

	administration.route.code

Procedures - flat?
	code/name
	date
	status

	bodysite.code

	type procedure/observation/act

Results - subarray
	code/name

	subarray (result)
		code/name
		date

		status

		value/unit

Allergies -subarray
	code/name

	date

	severity

	status

	subarray (reaction)
		code/name

Encounter - subarray
	code/name
	date

	subarray (findings)
		code/name

Demographics - special
	each set should be matched separately

	name

	dob

	gender

	marital_status

	subarray (addresses)

	phone

	email

	race

	religion

	subarray (languages)

	birthplace

	guardian



Social History - special

	smokingstatus.value

	date




Vital Signs - flat
Flat elements
Compare by name/code and fuzzy date comparison

Allergies -subarray
Subarray of allergic reactions
Compare on allergen name/code
Dedup of reactions as well 

Medications - flat
Flat object
Compare based on medications and fuzzy match on prescription time/range
Need to search through translations for possible med name match too
Dozes add to % of match (preconditions probably can be ignored)

Problems - flat
Flat object
Match based on code/name as well as partial on other attributes
negation/Status (resolved or active) are important

Results - subarray
Panels with list of results under
Simple match by panel name (and matching list of results under with data)
match object can be weird (since results are grouped in panels)

Demographics - special
match it element by element
Special match object returned showing JSON diffs by element

Social History - special
technically should be like demographcics
maybe needed special handling for smoking status
otherwize just return/match as vital signs (e.g. match by range only)

Immunization - flat
Flat object
Primary match by type of vaccine
Fuzzy match by administration/preformer and date
Needs handling vaccine name match by iterating through translations

Encounter - subarray
Findings are subarray
Primary match by location + fuzzy match by date
Needs handling of findings in returned match object
Codes for type of visits should be fuzzy matched (? CPT)

Procedures - flat?
Seems to be a flat object
that can be difficult (I think it has three types of entities that we flattened into same type)
match by bodysight, name/code,fuzzy on date/range and providers/locations fields



*/

Documentation:


Special html elements:

    <elem name="name"> - "Element" or "Elem" 
        - this element will be removed upon load, its html will be stored in "elems" array where the key would be the property "name".
        - used to populate lists from array.
            a special function maps content of an array such that set of characters "%key%" in the html of the elem will be raplaced by the coontent of an element mapped to "key" in the provided array.

    <fld name="name"> - "Field" or "Fld" 
        - this element will STAY in the code.
        - its html will be stored in "flds" array where the key would be the property "name".
        - the "fld_data" array of arrays is responsible for storring data displayed by all flds,
            (first key maps to the propperty "name", second to the "%???%" in the html of the fld)
        - an update could be called on a specific fld or on all (*global function is called on load)

    
    <view name="name"> - "View"
        - a specific element declared for the clarification of the html structure
        - removed from the code and stored in the "views" array.
        - special function foor changing views.

    <view_container> - "View Container"
        - a specific element declared for the clarification of the html structure
        - custom fullscreen behaviour.
        - !!!!MUST BE USED ONCE!!!!
        - where all the "view" elements will be spawned.

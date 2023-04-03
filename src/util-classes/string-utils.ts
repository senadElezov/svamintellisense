


class StringUtils {

    static convertToKebabCase(varName: string) {

        varName = varName.replace(/ /g, '');

        if (varName.includes('-')) {
            return varName.toLowerCase();
        }

        if (varName.includes('_')) {
            return varName.replace(/_/g, '-').toLowerCase()
        }


        const upperCaseMatch = varName.match(/[A-Z]/g)

        upperCaseMatch?.forEach((upperCaseLetter) =>
            varName = varName.replace(new RegExp(upperCaseLetter, 'g'), '-' + upperCaseLetter.toLowerCase())
        )


        if (varName.startsWith('-')) {
            varName = varName.substring(1);
        }

        return varName;

    }

}
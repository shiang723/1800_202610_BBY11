// A dropdown component that has all 44 countries in the FIFA 2026 World Cup.
// Made as used more than once and takes up a lot of space on html files.
class countrySelect extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
                    <select id="${this.localName}" class="form-select" aria-label="Select Team" required>
                        <option value="None">None</option>
                        <option value="Algeria">Algeria</option>
                        <option value="Argentina">Argentina</option>
                        <option value="Australia">Australia</option>
                        <option value="Austria">Austria</option>
                        <option value="Belgium">Belgium</option>
                        <option value="Brazil">Brazil</option>
                        <option value="Canada">Canada</option>
                        <option value="Cape Verde">Cape Verde</option>
                        <option value="Colombia">Colombia</option>
                        <option value="Croatia">Croatia</option>
                        <option value="Curaçao">Curaçao</option>
                        <option value="Ecuador">Ecuador</option>
                        <option value="Egypt">Egypt</option>
                        <option value="England">England</option>
                        <option value="France">France</option>
                        <option value="Germany">Germany</option>
                        <option value="Ghana">Ghana</option>
                        <option value="Haiti">Haiti</option>
                        <option value="Iran">Iran</option>
                        <option value="Ivory Coast">Ivory Coast</option>
                        <option value="Japan">Japan</option>
                        <option value="Jordan">Jordan</option>
                        <option value="Mexico">Mexico</option>
                        <option value="Morocco">Morocco</option>
                        <option value="Netherlands">Netherlands</option>
                        <option value="New Zealand">New Zealand</option>
                        <option value="Norway">Norway</option>
                        <option value="Panama">Panama</option>
                        <option value="Paraguay">Paraguay</option>
                        <option value="Portugal">Portugal</option>
                        <option value="Qatar">Qatar</option>
                        <option value="Saudi Arabia">Saudi Arabia</option>
                        <option value="Scotland">Scotland</option>
                        <option value="Senegal">Senegal</option>
                        <option value="Spain">Spain</option>
                        <option value="South Africa">South Africa</option>
                        <option value="South Korea">South Korea</option>
                        <option value="Sweden">Sweden</option>
                        <option value="Switzerland">Switzerland</option>
                        <option value="Tunisia">Tunisia</option>
                        <option value="Turkey">Turkey</option>
                        <option value="United States">United States</option>
                        <option value="Uruguay">Uruguay</option>
                        <option value="Uzbekistan">Uzbekistan</option>
                    </select>
        `;
    }
}
customElements.define('country-select', countrySelect);
import React from "react";
import { StructureContext } from './contexts/contexts'


const Columns = function () {
    const { structure } = React.useContext(StructureContext)

    function renderTableHeader(e) {
        const { id, name, limit } = e
        return (
            <th key={`tableHeader${id}`} className={'table-head--element th'}>
                <div className={'table-head__container'}>
                    <div className={'table-head-title__container'}>
                        <div>Status:</div>
                        <h2 className={'table-head__status-title'}>{name}</h2>
                    </div>
                    <div className={'table-head-limits__container'}>
                        <div>Tasks limit:</div>
                        <div>{limit}</div>
                    </div>
                </div>
            </th>
        )
    }

    return (
        <tr className={'tr'}>
            {structure.map((element) => {
                return renderTableHeader(element)
            })}
        </tr>
    )
}

export default Columns
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract CertifyRegistry {
    address public admin;

    mapping(address => bool) public registeredInstitutions;

    event InstitutionRegistered(address indexed institution);
    event InstitutionRevoked(address indexed institution);

    constructor() {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not authorized");
        _;
    }

    function registerInstitution(address _institution) external onlyAdmin {
        require(_institution != address(0), "Zero address");
        registeredInstitutions[_institution] = true;
        emit InstitutionRegistered(_institution);
    }

    function revokeInstitution(address _institution) external onlyAdmin {
        registeredInstitutions[_institution] = false;
        emit InstitutionRevoked(_institution);
    }

    function isInstitution(address _institution) external view returns (bool) {
        return registeredInstitutions[_institution];
    }
}

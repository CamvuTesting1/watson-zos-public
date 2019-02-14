//AUTOIPLW JOB ,'KMINER 407-493-5229 ',CLASS=A,MSGCLASS=X,             
//             MSGLEVEL=(2,0),NOTIFY=&SYSUID                           
/*JOBPARM  S=*                                                         
//*                                                                    
//*--------------------------------------------------------------------
//* Create symbols for the parms to passed to the AUTOIPL task         
//*--------------------------------------------------------------------
//EXPORT1  EXPORT SYMLIST=(IPLVOL,FORCE,TGTSYS)                        
//SETIPL   SET IPLVOL=__VOLSERTYPE__                                              
//SETFORCE SET FORCE=__FORCEBOOLEAN__                                                 
//SETTGT   SET TGTSYS=__SYSTEMNAME__                                      
//*                                                                    
//*--------------------------------------------------------------------
//* Place steps that will create syslog data after this point          
//*--------------------------------------------------------------------
//STARTIPL EXEC PGM=IKJEFT1B                                           
//SYSPROC  DD DISP=SHR,DSN=D55TST.TEST.CLIST                           
//SYSTSPRT DD SYSOUT=*                                                 
//SYSPRINT DD SYSOUT=*                                                 
//SYSTSIN  DD *,SYMBOLS=EXECSYS                                        
 %MVSCMD S AUTOIPL,FORCE=&FORCE,SYS=&TGTSYS,IPLVOL=&IPLVOL WAITTIME(2)                             
/*                                                                     
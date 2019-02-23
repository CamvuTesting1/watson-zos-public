//AUTOIPLW JOB CLASS=A,MSGCLASS=X,             
//             MSGLEVEL=(2,0),NOTIFY=&SYSUID                           
/*JOBPARM  S=*                                                         
//*                                                                    
//STARTIPL EXEC PGM=IKJEFT1B                                           
//SYSPROC  DD DISP=SHR,DSN=D55TST.TEST.CLIST                           
//SYSTSPRT DD SYSOUT=*                                                 
//SYSPRINT DD SYSOUT=*                                                 
//SYSTSIN  DD *,SYMBOLS=EXECSYS                                        
 %MVSCMD S AUTOIPL,FORCE=&FORCE,SYS=&TGTSYS,IPLVOL=&IPLVOL WAITTIME(2)                             
/*                                                                     